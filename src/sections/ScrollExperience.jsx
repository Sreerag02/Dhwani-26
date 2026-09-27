import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion, useMotionValueEvent } from "motion/react";
import KhaiHero from "../components/HeroReveal";
import ThemeReveal from "./ThemeReveal";
import Merch from "./Merch";
import ArtistReveal from "./ArtistReveal";
import { ARTIST_ANCHOR_PROGRESS, ORIGINAL_SCROLL, ARTIST_SCROLL, TOTAL_SCROLL, ARTIST_INSERT, ARTIST_START, ARTIST_END } from "./artistTimeline";
import "../components/Opening.css";
import "./ScrollExperience.css";

// Clouds sweep right-to-left across a dense 4x8 tile grid.  Every cloud crosses
// the centre of its tile at ~.22, so the viewport is fully covered in one
// shared moment a little before the theme settles (.309), then all clear by
// ~.30, ahead of the navy wipe opening at .379. Parallax comes from travel
// distance (front ring sweeps further/faster), while timing stays in a common
// window so the sheet never tears.
const CLOUD_LAYERS = Array.from({ length: 20 }, (_, index) => {
  const row = Math.floor(index / 5);
  const col = index % 5;
  const ring = row >= 2 ? 1 : 0;
  const colsX = [5, 27, 50, 73, 95];
  const rowsY = [10, 35, 60, 85];
  const micro = ((row * 3 + col * 5) % 7) - 3;
  const microY = ((col * 7 + row * 11) % 5) - 2;
  const travel = ring ? 125 + col * 15 : 195 + col * 20;
  const mid = .22 + Math.floor(index / 5) * .010;
  const start = mid - .22 + (row % 2) * .014 + col * .006;
  const end = mid + .075 + (col % 2) * .012;
  return {
    id: index,
    file: 2 + (row + col * 2) % 7,
    ring,
    left: colsX[col] + micro - 5,
    top: rowsY[row] + microY,
    from: `${travel}vw`,
    to: `-${travel}vw`,
    y: `${(row % 2 ? -1 : 1) * (10 + col * 5)}svh`,
    start,
    mid,
    end,
    turn: (row % 2 ? 1 : -1) * (ring ? 3 : 2) * (.5 + col / 2.5),
  };
});

const Cloud = React.memo(function Cloud({ layer, progress }) {
  const reduced = useReducedMotion();
  // x crosses 0vw (tile centre) at `mid`, y settles to its tile row by `mid`.
  const x = useTransform(progress, [layer.start, layer.mid, layer.end], [layer.from, "0vw", layer.to]);
  const y = useTransform(progress, [layer.start, layer.mid], [layer.y, "0svh"]);
  const rotate = useTransform(progress, [layer.start, layer.mid], [0, layer.turn]);
  return <motion.div className={`cloud-curtain-layer cloud-bloom-layer cloud-bloom-ring-${layer.ring}`}
    style={{ left: `${layer.left}%`, top: `${layer.top}%`, ...(reduced ? {} : { x, y, rotate, z: 0 }) }}>
    <img src={`/assets/curtain/${layer.file}.webp`} alt="" decoding="async" draggable="false" />
  </motion.div>;
});

// Subscribe only to boundary crossings. Unmount inactive curtains to release
// their large GPU surfaces and Motion subscriptions; remount on reverse scroll.
function CloudCurtainLayers({ progress, sceneProgress = progress, start = -Infinity, end }) {
  const inRange = value => value >= start && value < end;
  const [active, setActive] = useState(() => inRange(sceneProgress.get()));
  useMotionValueEvent(sceneProgress, "change", value => {
    const next = inRange(value);
    if (next !== active) setActive(next);
  });
  return active ? CLOUD_LAYERS.map(layer => <Cloud key={layer.id} layer={layer} progress={progress} />) : null;
}

const TUNNEL_LAYERS = [
  { base: .30, spin: -7, depth: .58, dir: -30, pan: 0 },
  { base: .47, spin: 5, depth: .74, dir: 15, pan: 20 },
  { base: .70, spin: -3, depth: .88, dir: -60, pan: 42 },
  { base: .98, spin: 2, depth: 1, dir: 120, pan: 66 },
];

function TunnelRing({ layer, pan, grow, progress, reduced }) {
  const rad = (layer.dir * Math.PI) / 180;
  const x = useTransform(pan, t => Math.cos(rad) * layer.pan * t);
  const y = useTransform(pan, t => Math.sin(rad) * layer.pan * t);
  const scale = useTransform(grow, g => layer.base * g);
  const opacity = useTransform(progress, t => layer.depth * (0.55 + 0.45 * t));
  return <motion.img decoding="async" className="merch-tunnel__tee" src="/assets/tshirt stroke.webp" alt="" draggable="false"
    style={{ scale: reduced ? 1 : scale, rotate: reduced ? 0 : layer.spin, opacity: reduced ? 1 : opacity, x: reduced ? 0 : x, y: reduced ? 0 : y }} />;
}

// The artist chapter is the stretch of scroll inserted at ARTIST_INSERT, so its
// own window is that insert range. Everything after it is the merch finale.
const ARTIST_INSERT_END = (ARTIST_INSERT * ORIGINAL_SCROLL + ARTIST_SCROLL) / TOTAL_SCROLL;

// One scroll value owns every phase, so the pin cannot release before the art
// reaches its final state (including when scrolling quickly or backwards).
export default function ScrollExperience({ onNavVisibility }) {
  const ref = useRef(null);
  const { scrollYProgress: journeyProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Insert artist scroll distance without changing the existing scene speeds.
  const progress = useTransform(journeyProgress,
    [0, ARTIST_INSERT * ORIGINAL_SCROLL / TOTAL_SCROLL, (ARTIST_INSERT * ORIGINAL_SCROLL + ARTIST_SCROLL) / TOTAL_SCROLL, 1],
    [0, ARTIST_INSERT, ARTIST_INSERT, 1]);
  const reduced = useReducedMotion();
  const introOpacity = useTransform(progress, [.053, .121], [1, 0]);
  const introVisibility = useTransform(progress, value => value >= .121 ? "hidden" : "visible");
  const introY = useTransform(progress, [0, .121], [0, -100]);
  const clouds = useTransform(progress, [.080, .309], [0, 1]);
  const ground = useTransform(clouds, [0, .077, .246], [1, 1, 0]);
  const cloudVisibility = useTransform(progress, value => value >= .564 ? "hidden" : "visible");
  // Second cloud curtain: reuses the same CLOUD_LAYERS and Cloud component,
  // just remapped to fire right after Khai fades out and into the artist chapter.
  const curtain2Progress = useTransform(progress, [.645, .698], [0, 0.32]);
  const curtain2Visibility = useTransform(progress, value => value < .645 || value >= .698 ? "hidden" : "visible");
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
  const revealOpacity = useTransform(progress, [.720, .770, .820], [0, 1, 0]);
  const revealVisibility = useTransform(progress, value => value < .720 || value >= .820 ? "hidden" : "visible");
  // Parallax tunnel: four evenly-nested stroke rings share ONE zoom clock and
  // grow together like a single camera diving through the tee. A per-ring
  // parallax pan (deeper rings drift least, nearer rings whip past fastest,
  // each on its own travel direction) gives the depth that a plain zoom lacks.
  const tunnelIn = useTransform(progress, [.720, .820], [0, 1], { clamp: true });
  const tunnelGrow = useTransform(tunnelIn, t => 1 + 1.6 * t * t);
  const tunnelPan = useTransform(tunnelIn, t => t * t);
  // Handoff Khai -> artists: Khai fades out early, right after its hero animation
  // finishes at .645, leaving minimal dead hold time.
  const khaiOpacity = useTransform(progress, [.650, .700], [1, 0]);
  const khaiVisibility = useTransform(progress, value => value < .403 || value >= .700 ? "hidden" : "visible");
  // Merch bleeds in while the tunnel is still visible, so it
  // peeks through the t-shirt outlines as they fade. Remap so Merch.jsx
  // internals stay exactly as authored.
  const remappedMerchProgress = useTransform(progress, [.780, 1], [.84, 1]);
  const merchVisibility = useTransform(progress, value => value < .780 ? "hidden" : "visible");
  
  // Bridge the gap left by the removed video section with a solid background fade
  const transitionFade = useTransform(progress, [.680, .720, .780, .810], [0, 1, 1, 0]);
  const transitionVisibility = useTransform(progress, value => value < .680 || value >= .810 ? "hidden" : "visible");

  // Header visibility is a scroll position, not a latch. `journeyProgress` is the
  // only signal that moves inside the pin, since every scene here shares one
  // sticky box and cannot be observed individually. Returning the same value is
  // a no-op, so this only re-renders on the two boundaries.
  const inArtistWindow = value => value >= ARTIST_START && value <= ARTIST_INSERT_END;
  const [journeyNav, setJourneyNav] = useState(false);
  useMotionValueEvent(journeyProgress, "change", value => {
    setJourneyNav(prev => (prev === inArtistWindow(value) ? prev : inArtistWindow(value)));
  });
  // A deep link such as /#artists can mount inside the window, before the first
  // change event, so seed from the measured position on mount.
  useEffect(() => { setJourneyNav(inArtistWindow(journeyProgress.get())); }, [journeyProgress]);
  useEffect(() => { onNavVisibility?.(journeyNav); }, [journeyNav, onNavVisibility]);

  return <section ref={ref} id="world" className="reveal-journey" aria-label="World of Dhwani, Khai, artists and merchandise"
    style={{ height: `${TOTAL_SCROLL + 100}svh`, "--artist-anchor": `${(ARTIST_START + (ARTIST_END - ARTIST_START) * ARTIST_ANCHOR_PROGRESS) * TOTAL_SCROLL}svh` }}>
    <span id="theme-reveal" className="journey-anchor theme-anchor" />
    <span id="artists" className="journey-anchor artist-anchor" />
    <span id="khai" className="journey-anchor khai-anchor" />
    <span id="merch" className="journey-anchor merch-anchor" />
    <div className="journey-sticky">
      <motion.div className="journey-scene" style={{ visibility: themeVisibility }}>
        <ThemeReveal progress={theme} sceneProgress={progress} embedded />
      </motion.div>
      <motion.div className="journey-scene khai-journey cloud-journey-sticky" style={{ opacity: khaiOpacity, visibility: khaiVisibility }}>
        <KhaiHero progress={hero} sceneProgress={progress} />
      </motion.div>
      <motion.div className="section-transition-fade" style={{ opacity: transitionFade, visibility: transitionVisibility, position: 'absolute', inset: 0, backgroundColor: '#11103b', zIndex: 1 }} aria-hidden="true" />
      <motion.div className="cloud-curtain" style={{ visibility: cloudVisibility }} aria-hidden="true">
        <motion.div className="cloud-curtain-ground" style={{ opacity: ground }} />
        <CloudCurtainLayers progress={progress} end={reduced ? .564 : .36} />
      </motion.div>
      {/* Second curtain: same clouds reused, fires Khai → artists */}
      <motion.div className="cloud-curtain cloud-curtain--2" style={{ visibility: curtain2Visibility }} aria-hidden="true">
        <CloudCurtainLayers progress={curtain2Progress} sceneProgress={progress} start={.63} end={.70} />
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
      <motion.div className="scroll-mask" style={{ opacity: maskOpacity, visibility: maskVisibility, z: 0 }} aria-hidden="true">
        <motion.img decoding="async" src="/assets/mascot/mascot%20mask.svg" alt="" draggable="false" style={{ scale: reduced ? 1 : maskScale, z: 0 }} />
      </motion.div>
      <motion.div className="world-intro journey-scene" style={{ opacity: introOpacity, visibility: introVisibility, z: 0 }}>
        <motion.div style={{ y: reduced ? 0 : introY, z: 0 }} className="world-intro__stack">
          <p>COLLEGE OF ENGINEERING, TRIVANDRUM</p>
          <h1>WORLD OF</h1>
          <img decoding="async" className="world-intro__wordmark" src="/assets/logo/dhwani-text.webp" alt="DHWANI" />
        </motion.div>
      </motion.div>
      <ArtistReveal journeyProgress={journeyProgress} />
      <motion.div className="merch-journey" style={{ visibility: merchVisibility }}>
        <Merch progress={remappedMerchProgress} sceneProgress={progress} />
      </motion.div>
      <motion.div className="merch-tunnel" style={{ opacity: revealOpacity, visibility: revealVisibility }} aria-hidden="true">
        {TUNNEL_LAYERS.map((layer, i) => (
          <TunnelRing key={i} layer={layer} pan={tunnelPan} grow={tunnelGrow} progress={tunnelIn} reduced={reduced} />
        ))}
      </motion.div>
    </div>
  </section>;
}
