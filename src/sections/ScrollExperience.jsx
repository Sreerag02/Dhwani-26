import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import KhaiHero from "../components/HeroReveal";
import ThemeReveal from "./ThemeReveal";
import "../components/Opening.css";
import "./ScrollExperience.css";

// Clouds sweep right-to-left across a dense 4x8 tile grid.  Every cloud crosses
// the centre of its tile at ~.40-.42, so the viewport is fully covered in one
// shared moment, then all clear by ~.50 (before the mask at .52). Parallax
// comes from travel distance (front ring sweeps further/faster), while timing
// stays in a common window so the sheet never tears.
const CLOUD_LAYERS = Array.from({ length: 32 }, (_, index) => {
  const row = Math.floor(index / 4);
  const col = index % 4;
  const ring = row >= 4 ? 1 : 0;
  const colsX = [4, 33, 62, 92];
  const rowsY = [8, 19, 30, 41, 53, 64, 75, 86];
  const micro = ((row * 3 + col * 5) % 7) - 3;
  const microY = ((col * 7 + row * 11) % 5) - 2;
  const travel = ring ? 125 + col * 15 : 195 + col * 20;
  const start = 0 + (row % 2) * .02 + col * .006;
  const mid = .34 + Math.floor(index / 8) * .006;
  const end = .48 + (col % 2) * .012;
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
  const introOpacity = useTransform(progress, [.08, .18], [1, 0]);
  const introVisibility = useTransform(progress, value => value >= .18 ? "hidden" : "visible");
  const introY = useTransform(progress, [0, .18], [0, -100]);
  const clouds = useTransform(progress, [.12, .46], [0, 1]);
  const ground = useTransform(clouds, [0, .10, .32], [1, 1, 0]);
  const cloudVisibility = useTransform(progress, value => value >= .84 ? "hidden" : "visible");
  const theme = useTransform(progress, [.20, .46], [0, 1]);
  const themeVisibility = useTransform(progress, value => value >= .62 ? "hidden" : "visible");
  const maskOpacity = useTransform(progress, [.52, .60, .65, .76], [0, 1, 1, 0]);
  const maskBg = useTransform(progress, [.52, .58], [0, 1]);
  const maskScale = useTransform(progress, [.52, .76], [.35, 3]);
  const maskVisibility = useTransform(progress, value => value < .52 || value >= .76 ? "hidden" : "visible");
  const dripScale = useTransform(progress, [.56, .66], [.14, 3.2]);
  const dripOpacity = useTransform(progress, [.56, .60, .66, .70], [0, 1, 1, 0]);
  const dripVisibility = useTransform(progress, value => value < .56 || value >= .70 ? "hidden" : "visible");
  const heroVisibility = useTransform(progress, value => value < .60 ? "hidden" : "visible");
  const hero = useTransform(progress, [.64, .94], [.50, 1]);

  return <section ref={ref} id="world" className="reveal-journey" aria-label="Gates of Dhwani to Khai reveal">
    <span id="theme-reveal" className="journey-anchor theme-anchor" />
    <span id="khai" className="journey-anchor khai-anchor" />
    <div className="journey-sticky">
      <motion.div className="journey-scene" style={{ visibility: themeVisibility }}>
        <ThemeReveal progress={theme} embedded />
      </motion.div>
      <motion.div className="journey-scene khai-journey cloud-journey-sticky" style={{ visibility: heroVisibility }}>
        <KhaiHero progress={hero} />
      </motion.div>
      <motion.div className="cloud-curtain" style={{ visibility: cloudVisibility }} aria-hidden="true">
        <motion.div className="cloud-curtain-ground" style={{ opacity: ground }} />
        {CLOUD_LAYERS.map(layer => <Cloud key={layer.id} layer={layer} progress={progress} />)}
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
    </div>
  </section>;
}
