import { createContext, useContext, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, useSpring } from "motion/react";
import FerrisWheel from "../components/FerrisWheel";
import "./ThemeReveal.css";

const E = "/assets/elements/";
const TimelineContext = createContext(null);
const lanterns = [
  ["L1.svg", "lamp-a"], ["L2.svg", "lamp-b"], ["L3.svg", "lamp-c"],
  ["L4.svg", "lamp-d"], ["L4.svg", "lamp-e"], ["L1.svg", "lamp-f"],
  ["L2.svg", "lamp-g"], ["L1.svg", "lamp-h"],
];
const notes = [
  ["note.svg","note-a"], ["blue note.svg","note-b"],
  ["note.svg","note-c"], ["blue note.svg","note-d"],
  ["blue note.svg","note-e"], ["note.svg","note-f"],
];
/* Kicker fades in late (theme progress .55-1), i.e. as the cloud curtain parts. */
const KICKER_FADE = [.55, 1];
const DEFAULT_FADE = [0, .65];
/* Observe the stationary wrapper, never the image starting outside the viewport. */
function RevealLayer({ className, src, alt = "", from = 0, float = false, fade = null, depth = 1, zoom = true, children }) {
  const sharedProgress = useContext(TimelineContext);
  const ref = useRef(null);
  const props = { className, src, alt, from, float, fade, depth, zoom, children };
  return <div ref={ref} className={"carnival-layer " + className}>
    {sharedProgress ? <LayerMotion {...props} progress={sharedProgress} /> : <ViewportLayer {...props} target={ref} />}
  </div>;
}

function ViewportLayer({ target, ...props }) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "start 35%"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 220, damping: 34, mass: .45 });
  return <LayerMotion {...props} progress={reduced ? scrollYProgress : smoothProgress} />;
}

function LayerMotion({ className, src, alt, from, float, fade, depth = 1, zoom = true, progress, children }) {
  const reduced = useReducedMotion();
  // z-axis parallax: each layer travels in from an offset proportional to its
  // depth, so the foreground clouds whip past while the backdrop barely drifts,
  // and gate/khai settle on their own planes. Far layers start slightly small,
  // near layers slightly large, then all converge to rest at progress 1.
  // `zoom={false}` keeps a layer's edges fixed (e.g. the full-bleed stalls) while
  // still letting it drift on the z-axis.
  const x = useTransform(progress, [0, 1], [from * depth, 0]);
  const y = useTransform(progress, [0, 1], [90 * depth, 0]);
  const opacity = useTransform(progress, fade ?? DEFAULT_FADE, [0, 1]);
  const rest = className === "carnival-title" ? .78 : 1;
  const scale = useTransform(progress, [0, 1], [zoom ? rest * (.9 + .1 * depth) : rest, 1]);
  return <motion.div style={reduced ? undefined : { opacity, x, y, scale }}>
      {children || <img className={float ? "carnival-float" : ""} src={src}
        alt={alt} draggable="false" loading="lazy" decoding="async" />}
    </motion.div>;
}

export default function ThemeReveal({ progress = null, embedded = false, onReady = null }) {
  const ref = useRef(null);
  const [playing,setPlaying] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    let visible = false;
    const update = () => setPlaying(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting; update();
    });
    observer.observe(ref.current);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);
  useEffect(() => {
    if (!onReady) return;
    let cancelled = false;
    const imgs = Array.from(ref.current?.querySelectorAll("img") ?? []);
    const pending = imgs.map(img => new Promise(resolve => {
      if (img.complete && img.naturalWidth > 0) return resolve();
      img.loading = "eager";
      const finish = () => { img.removeEventListener("load", finish); img.removeEventListener("error", finish); resolve(); };
      img.addEventListener("load", finish);
      img.addEventListener("error", finish);
      if (img.complete) resolve();
    }));
    Promise.all(pending).then(() => { if (!cancelled) onReady(); });
    return () => { cancelled = true; };
  }, [onReady]);
  return <TimelineContext.Provider value={progress}><section ref={ref} id={embedded ? undefined : "theme-reveal"} className={`carnival${embedded ? " carnival-embedded" : ""}`} aria-label="Carnivale Razzmatazz"
    data-playing={playing && !reduced}>
    <RevealLayer className="carnival-stalls" src={E+"stalls.png"} depth={.3} zoom={false} />
    <div className="carnival-stage">
      <RevealLayer className="carnival-kicker" from={0} fade={KICKER_FADE} depth={1}>
        <img src="/assets/logo/dhwani26-text.png" alt="Dhwani '26" draggable="false" />
      </RevealLayer>
      <RevealLayer className="carnival-wheel" depth={.55}>
        <FerrisWheel duration={48} running={playing && !reduced} />
      </RevealLayer>
      <RevealLayer className="carnival-blue" src={E+"CLOUDS.svg"} from={-70} depth={.45} />
      <RevealLayer className="carnival-gate" src={E+"torii new.svg"} depth={.85} />
      <RevealLayer className="hidden-khai" src={E+"khai-hidden.png"} depth={1.05} />
      <RevealLayer className="carnival-title" src={E+"title.svg"} alt="Carnivale Razzmatazz" depth={1} />
      {lanterns.map(([file,pos],i) => <RevealLayer key={pos} className={pos} src={E+file} from={i%2 ? 110 : -110} depth={1.2} float />)}
      {notes.map(([file,pos],i) => <RevealLayer key={pos} className={pos} src={E+file} from={i%2 ? 60 : -60} depth={1.25} float />)}
    </div>
    <RevealLayer className="carnival-base-clouds" src={E+"theme-cloud.webp"} depth={1.5} float />
  </section></TimelineContext.Provider>;
}
