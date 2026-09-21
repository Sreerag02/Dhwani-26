import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import KhaiHero from "../components/HeroReveal";
import ThemeReveal from "./ThemeReveal";
import Merch from "./Merch";
import VideoTransition from "./VideoTransition";
import "../components/Opening.css";
import "./ScrollExperience.css";

// Clouds sweep right-to-left across a dense 4x8 tile grid.  Every cloud crosses
// the centre of its tile at ~.22, so the viewport is fully covered in one
// shared moment a little before the theme settles (.309), then all clear by
// ~.30, ahead of the navy wipe opening at .379. Parallax comes from travel
// distance (front ring sweeps further/faster), while timing stays in a common
// window so the sheet never tears.
const CLOUD_LAYERS = Array.from({ length: 32 }, (_, index) => {
  const row = Math.floor(index / 4);
  const col = index % 4;
  const ring = row >= 4 ? 1 : 0;
  const colsX = [4, 33, 62, 92];
  const rowsY = [8, 19, 30, 41, 53, 64, 75, 86];
  const micro = ((row * 3 + col * 5) % 7) - 3;
  const microY = ((col * 7 + row * 11) % 5) - 2;
  const travel = ring ? 125 + col * 15 : 195 + col * 20;
  const mid = .22 + Math.floor(index / 8) * .006;
  const start = mid - .22 + (row % 2) * .014 + col * .004;
  const end = mid + .075 + (col % 2) * .008;
  return {
    id: index,
    file: 2 + (row + col * 2) % 7,
    ring,
    left: colsX[col] + micro,
    top: rowsY[row] + microY,
    from: `${travel}vw`,
    to: `-${travel}vw`,
    y: `${(row % 2 ? -1 : 1) * (8 + col * 4)}svh`,
    start,
    mid,
    end,
    turn: (row % 2 ? 1 : -1) * (ring ? 3 : 2) * (.5 + col / 3),
  };
});

function Cloud({ layer, progress }) {
  const reduced = useReducedMotion();
  // x crosses 0vw (tile centre) at `mid`, y settles to its tile row by `mid`.
  const x = useTransform(progress, [layer.start, layer.mid, layer.end], [layer.from, "0vw", layer.to]);
  const y = useTransform(progress, [layer.start, layer.mid], [layer.y, "0svh"]);
  const rotate = useTransform(progress, [layer.start, layer.mid], [0, layer.turn]);
  return <motion.div className={`cloud-curtain-layer cloud-bloom-layer cloud-bloom-ring-${layer.ring}`}
    style={{ left: `${layer.left}%`, top: `${layer.top}%`, ...(reduced ? {} : { x, y, rotate }) }}>
    <img src={`/assets/curtain/${layer.file}.png`} alt="" decoding="async" draggable="false" />
  </motion.div>;
}

// One scroll value owns every phase, so the pin cannot release before the art
// reaches its final state (including when scrolling quickly or backwards).
export default function ScrollExperience() {
  const ref = useRef(null);
  const { scrollYProgress: progress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const reduced = useReducedMotion();
  const introOpacity = useTransform(progress, [.053, .121], [1, 0]);
  const introVisibility = useTransform(progress, value => value >= .121 ? "hidden" : "visible");
  const introY = useTransform(progress, [0, .121], [0, -100]);
  const clouds = useTransform(progress, [.080, .309], [0, 1]);
  const ground = useTransform(clouds, [0, .077, .246], [1, 1, 0]);
  const cloudVisibility = useTransform(progress, value => value >= .564 ? "hidden" : "visible");
  // Second cloud curtain: reuses the same CLOUD_LAYERS and Cloud component,
  // just remapped to fire right after Khai fades out and before the video.
  const curtain2Progress = useTransform(progress, [.690, .740], [0, 1]);
  const curtain2Ground = useTransform(curtain2Progress, [0, .077, .246], [1, 1, 0]);
  const curtain2Visibility = useTransform(progress, value => value < .690 || value >= .740 ? "hidden" : "visible");
  const theme = useTransform(progress, [.134, .309], [0, 1]);
  const themeVisibility = useTransform(progress, value => value >= .45 ? "hidden" : "visible");
  const maskOpacity = useTransform(progress, [.379, .433, .467, .541], [0, 1, 1, 0]);
  const maskBg = useTransform(progress, [.379, .419, .541], [0, 1, 0]);
  const maskScale = useTransform(progress, [.379, .541], [.35, 3]);
  const maskVisibility = useTransform(progress, value => value < .379 || value >= .541 ? "hidden" : "visible");
  const dripScale = useTransform(progress, [.407, .474], [.14, 3.2]);
  const dripOpacity = useTransform(progress, [.407, .433, .474, .500], [0, 1, 1, 0]);
  const dripVisibility = useTransform(progress, value => value < .407 || value >= .500 ? "hidden" : "visible");
  const heroVisibility = useTransform(progress, value => value < .403 ? "hidden" : "visible");
  const hero = useTransform(progress, [.403, .645], [.50, 1.18]);
  // Finale: a tunnel of concentric t-shirt outlines zooms in for the gateway
  // (each layer scales from a different depth and drifts to centre), then the
  // merch poster pops in over pink + texture and, with further scroll, the
  // backdrop melts pink→blue while the tees shift over and the merch objects
  // (badges, bandanas, fannies, kit) pop out around them. Scroll driven.
  const revealOpacity = useTransform(progress, [.785, .815, .845], [0, 1, 0]);
  const revealVisibility = useTransform(progress, value => value < .785 || value >= .845 ? "hidden" : "visible");
  // Parallax tunnel: four evenly-nested stroke rings share ONE zoom clock and
  // grow together like a single camera diving through the tee. A per-ring
  // parallax pan (deeper rings drift least, nearer rings whip past fastest,
  // each on its own travel direction) gives the depth that a plain zoom lacks.
  const tunnelIn = useTransform(progress, [.785, .845], [0, 1], { clamp: true });
  const tunnelGrow = useTransform(tunnelIn, t => 1 + 1.6 * t * t);
  const tunnelPan = useTransform(tunnelIn, t => t * t);
  const tunnelLayers = [
    { base: .30, spin: -7, depth: .58, dir: -30, pan: 0 },
    { base: .47, spin: 5, depth: .74, dir: 15, pan: 20 },
    { base: .70, spin: -3, depth: .88, dir: -60, pan: 42 },
    { base: .98, spin: 2, depth: 1, dir: 120, pan: 66 },
  ].map((layer) => {
    const rad = (layer.dir * Math.PI) / 180;
    return {
      ...layer,
      x: useTransform(tunnelPan, t => Math.cos(rad) * layer.pan * t),
      y: useTransform(tunnelPan, t => Math.sin(rad) * layer.pan * t),
      scale: useTransform(tunnelGrow, g => layer.base * g),
      opacity: useTransform(tunnelIn, t => layer.depth * (0.55 + 0.45 * t)),
    };
  });
  // Handoff khai -> video: Khai fades out early, right after its hero animation
  // finishes at .645, leaving minimal dead hold time.
  const khaiOpacity = useTransform(progress, [.650, .700], [1, 0]);
  const khaiVisibility = useTransform(progress, value => value < .403 || value >= .700 ? "hidden" : "visible");
  // Skateboard video transition: cuts in right as Khai fades out, plays
  // fully, then the t-shirt tunnel follows it (not the other way around).
  const videoFade = useTransform(progress, [.735, .750, .778, .800], [0, 1, 1, 0]);
  const videoVisibility = useTransform(progress, value => value < .735 || value >= .800 ? "hidden" : "visible");
  // Merch starts after tunnel ends at .845.
  const remappedMerchProgress = useTransform(progress, [.855, 1], [.84, 1]);
  const merchVisibility = useTransform(progress, value => value < .855 ? "hidden" : "visible");

  return <section ref={ref} id="world" className="reveal-journey" aria-label="Gates of Dhwani to Khai reveal">
    <span id="theme-reveal" className="journey-anchor theme-anchor" />
    <span id="khai" className="journey-anchor khai-anchor" />
    <div className="journey-sticky">
      <motion.div className="journey-scene" style={{ visibility: themeVisibility }}>
        <ThemeReveal progress={theme} embedded />
      </motion.div>
      <motion.div className="journey-scene khai-journey cloud-journey-sticky" style={{ opacity: khaiOpacity, visibility: khaiVisibility }}>
        <KhaiHero progress={hero} />
      </motion.div>
      <motion.div className="cloud-curtain" style={{ visibility: cloudVisibility }} aria-hidden="true">
        <motion.div className="cloud-curtain-ground" style={{ opacity: ground }} />
        {CLOUD_LAYERS.map(layer => <Cloud key={layer.id} layer={layer} progress={progress} />)}
      </motion.div>
      {/* Second curtain: same clouds reused, fires Khai→Video */}
      <motion.div className="cloud-curtain cloud-curtain--2" style={{ visibility: curtain2Visibility }} aria-hidden="true">
        <motion.div className="cloud-curtain-ground" style={{ opacity: curtain2Ground }} />
        {CLOUD_LAYERS.map(layer => <Cloud key={`c2-${layer.id}`} layer={layer} progress={curtain2Progress} />)}
      </motion.div>
      <motion.div className="scroll-mask-bg" style={{ opacity: maskBg }} aria-hidden="true" />
      <motion.div className="concentric-rings" style={{ opacity: dripOpacity, visibility: dripVisibility }} aria-hidden="true">
        <motion.svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"
          style={{ scale: reduced ? 1 : dripScale }}>
          {[
            [283, "#1f1d66"],
            [235, "#25155e"],
            [190, "#4f1982"],
            [148, "#cb62ff71"],
            [112, "#341350"],
            [82, "#5c1982"],
            [54, "#3400676e"],
            [30, "#25155e"],
          ].map(([r, fill], i) =>
            <circle key={i} cx="200" cy="150" r={r} fill="none" stroke={fill}
              strokeWidth={20} opacity={.9 - i * .05} />
          )}
        </motion.svg>
      </motion.div>
      <motion.div className="scroll-mask" style={{ opacity: maskOpacity, visibility: maskVisibility }} aria-hidden="true">
        <motion.img src="/assets/mascot/mascot%20mask.svg" alt="" draggable="false" style={{ scale: reduced ? 1 : maskScale }} />
      </motion.div>
      <motion.div className="world-intro journey-scene" style={{ opacity: introOpacity, visibility: introVisibility }}>
        <motion.div style={{ y: reduced ? 0 : introY }} className="world-intro__stack">
          <p>COLLEGE OF ENGINEERING, TRIVANDRUM</p>
          <h1>WORLD OF</h1>
          <img className="world-intro__wordmark" src="/assets/logo/dhwani-text.png" alt="DHWANI" />
        </motion.div>
      </motion.div>
      <motion.div className="video-transition-wrapper" style={{ opacity: videoFade, visibility: videoVisibility }}>
        <VideoTransition
          progress={progress}
          start={.735}
          end={.800}
        />
      </motion.div>
      <motion.div className="merch-journey" style={{ visibility: merchVisibility }}>
        <Merch progress={remappedMerchProgress} />
      </motion.div>
      <motion.div className="merch-tunnel" style={{ opacity: revealOpacity, visibility: revealVisibility }} aria-hidden="true">
        {tunnelLayers.map((layer, i) => (
          <motion.img key={i} className="merch-tunnel__tee" src="/assets/tshirt stroke.png" alt="" draggable="false"
            style={{ scale: reduced ? 1 : layer.scale, rotate: reduced ? 0 : layer.spin, opacity: reduced ? 1 : layer.opacity, x: reduced ? 0 : layer.x, y: reduced ? 0 : layer.y }} />
        ))}
      </motion.div>
    </div>
  </section>;
}
