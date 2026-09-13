import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, useSpring } from "motion/react";
import "./ThemeReveal.css";

const E = "/assets/elements/";
const M = "/assets/mascot/";
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
const clouds = [
  ["cloud-left.png","mist-a"], ["cloud-2.png","mist-b"],
  ["cloud-leftup.png","mist-c"], ["cloud-1.png","mist-d"],
  ["cloud-left.png","mist-e"], ["cloud-2.png","mist-f"],
  ["cloud-leftup.png","mist-g"], ["cloud-1.png","mist-h"],
];

/* Observe the stationary wrapper, never the image starting outside the viewport. */
function RevealLayer({ className, src, alt = "", from = 0, float = false }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 35%"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 220, damping: 34, mass: .45 });
  const progress = reduced ? scrollYProgress : smoothProgress;
  const x = useTransform(progress, [0, 1], [from, 0]);
  const y = useTransform(progress, [0, 1], [90, 0]);
  const opacity = useTransform(progress, [0, .65], [0, 1]);
  const scale = useTransform(progress, [0, 1], [className === "carnival-title" ? .78 : 1, 1]);
  return <div ref={ref} className={"carnival-layer " + className}>
    <motion.div style={reduced ? undefined : { opacity, x, y, scale }}>
      <img className={float ? "carnival-float" : ""} src={src}
        alt={alt} draggable="false" loading="lazy" decoding="async" />
    </motion.div>
  </div>;
}

export default function ThemeReveal() {
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
  return <section ref={ref} id="theme-reveal" className="carnival" aria-label="Carnivale Razzmatazz"
    data-playing={playing && !reduced}>
    <div className="carnival-stage">
      <p className="carnival-kicker">DHWANI ’26 <span>THE THEME</span></p>
      <RevealLayer className="carnival-wheel" src={E+"new ferris.svg"} />
      <RevealLayer className="carnival-blue" src={E+"CLOUDS.svg"} from={-70} />
      <RevealLayer className="carnival-gate-far" src={E+"torii new.svg"} />
      <RevealLayer className="carnival-gate" src={E+"torii new.svg"} />
      <RevealLayer className="carnival-title" src={E+"title.svg"} alt="Carnivale Razzmatazz" />
      {lanterns.map(([file,pos],i) => <RevealLayer key={pos} className={pos} src={E+file} from={i%2 ? 110 : -110} float />)}
      {notes.map(([file,pos],i) => <RevealLayer key={pos} className={pos} src={E+file} from={i%2 ? 60 : -60} float />)}
      {clouds.map(([file,pos],i) => <RevealLayer key={pos} className={pos} src={M+file} from={i%2 ? 180 : -180} float />)}
    </div>
  </section>;
}
