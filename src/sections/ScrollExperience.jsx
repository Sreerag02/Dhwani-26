import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import KhaiHero from "../components/HeroReveal";
import ThemeReveal from "./ThemeReveal";
import "../components/Opening.css";
import "./ScrollExperience.css";

// Two overlapping rings open toward all eight compass directions.
const CLOUD_LAYERS = Array.from({ length: 16 }, (_, index) => {
  const ring = Math.floor(index / 8);
  const direction = index % 8;
  const angle = direction * Math.PI / 4 - Math.PI / 2;
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  return {
    id: index,
    file: 2 + (direction + ring * 3) % 7,
    ring,
    left: 50 + dx * (ring ? 20 : 39),
    top: 50 + dy * (ring ? 22 : 43),
    x: `${dx * (ring ? 105 : 90)}vw`,
    y: `${dy * (ring ? 115 : 100)}svh`,
    start: ring ? .07 : .02,
    end: ring ? .76 : .68,
    turn: (direction % 2 ? 1 : -1) * (ring ? 5 : 3),
  };
});

function Cloud({ layer, progress }) {
  const reduced = useReducedMotion();
  const x = useTransform(progress, [layer.start, layer.end], ["0vw", layer.x]);
  const y = useTransform(progress, [layer.start, layer.end], ["0svh", layer.y]);
  const rotate = useTransform(progress, [layer.start, layer.end], [0, layer.turn]);
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
  const cloudOpacity = useTransform(clouds, [.66, .84], [1, 0]);
  const cloudVisibility = useTransform(clouds, value => value >= .84 ? "hidden" : "visible");
  const theme = useTransform(progress, [.20, .46], [0, 1]);
  const themeVisibility = useTransform(progress, value => value >= .62 ? "hidden" : "visible");
  const maskOpacity = useTransform(progress, [.52, .60, .65, .76], [0, 1, 1, 0]);
  const maskScale = useTransform(progress, [.52, .76], [.35, 3]);
  const maskVisibility = useTransform(progress, value => value < .52 || value >= .76 ? "hidden" : "visible");
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
      <motion.div className="cloud-curtain" style={{ opacity: cloudOpacity, visibility: cloudVisibility }} aria-hidden="true">
        <motion.div className="cloud-curtain-ground" style={{ opacity: ground }} />
        {CLOUD_LAYERS.map(layer => <Cloud key={layer.id} layer={layer} progress={clouds} />)}
      </motion.div>
      <motion.div className="scroll-mask" style={{ opacity: maskOpacity, visibility: maskVisibility }} aria-hidden="true">
        <motion.img src="/assets/mascot/mascot%20mask.svg" alt="" draggable="false" style={{ scale: reduced ? 1 : maskScale }} />
      </motion.div>
      <motion.div className="world-intro journey-scene" style={{ opacity: introOpacity, visibility: introVisibility }}>
        <motion.div style={{ y: reduced ? 0 : introY }}>
          <p>COLLEGE OF ENGINEERING, TRIVANDRUM</p>
          <h1><span>WORLD OF</span>DHWANI</h1>
          <span className="world-year">’26</span>
        </motion.div>
      </motion.div>
    </div>
  </section>;
}
