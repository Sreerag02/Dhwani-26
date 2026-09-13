import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
} from "motion/react";

const MASCOT = "/assets/mascot/";
import "./MascotHero.css";
import "./Opening.css";

function Gates({ onEnter }) {
  return (
    <motion.section
      className="gates"
      onClick={onEnter}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.04,
      }}
      transition={{ duration: 0.55 }}
    >
      <motion.div
        className="gates__border gates__border--left"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        exit={{ scaleY: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      <motion.div
        className="gates__border gates__border--right"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        exit={{ scaleY: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      <motion.div
        className="gates__content"
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: -25,
        }}
        transition={{
          duration: 0.75,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <motion.p
          className="gates__eyebrow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          CET PRESENTS
        </motion.p>

        <motion.div
          className="gates__title-wrap"
          initial={{
            opacity: 0,
            y: 35,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
            duration: 0.85,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <span className="gates__title-shadow">
            THE GATES
          </span>

          <h1 className="gates__title">
            THE GATES
            <span>OF DHWANI</span>
          </h1>
        </motion.div>

        <motion.div
          className="gates__line"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            delay: 0.5,
            duration: 0.7,
          }}
        />

        <motion.button
          type="button"
          className="gates__enter"
          onClick={(event) => { event.stopPropagation(); onEnter(); }}
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.94 }}
          transition={{ delay: 0.65 }}
        >
          <span>ENTER THE REALM</span>
          <span className="gates__arrow">→</span>
        </motion.button>
      </motion.div>

      <p className="gates__year">MMXXVI</p>
    </motion.section>
  );
}

function MaskReveal({ onComplete }) {
  return (
    <motion.section
      className="mask-reveal"
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
      }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 1.8,
        times: [0, 0.18, 0.58, 1],
        ease: "easeInOut",
      }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        className="mask-reveal__ring mask-reveal__ring--one"
        initial={{
          scale: 0.15,
          opacity: 0,
        }}
        animate={{
          scale: 3,
          opacity: [0, 0.55, 0],
        }}
        transition={{ duration: 1.55 }}
      />

      <motion.div
        className="mask-reveal__ring mask-reveal__ring--two"
        initial={{
          scale: 0.1,
          opacity: 0,
        }}
        animate={{
          scale: 2.5,
          opacity: [0, 0.45, 0],
        }}
        transition={{
          delay: 0.12,
          duration: 1.55,
        }}
      />

      <motion.img
        className="mask-reveal__image"
        src={`${MASCOT}mascot%20mask.svg`}
        alt=""
        draggable="false"
        initial={{
          scale: 0.28,
          rotate: -4,
        }}
        animate={{
          scale: 2.8,
          rotate: 0,
        }}
        transition={{
          duration: 1.75,
          ease: [0.65, 0, 0.35, 1],
        }}
      />
    </motion.section>
  );
}


const CLOUDS = [["cloud-left.png","one"],["cloud-rightup.png","two"],["cloud-1.png","three"],["cloud-leftup.png","four"],["cloud-2.png","five"],["cloud-leftup.png","six"]];
function KhaiHero({ progress }) {
  const scene = useRef(null);
  const [active, setActive] = useState(true);
  const [tap, setTap] = useState(0);
  const reduced = useReducedMotion();
  const entrance = useTransform(progress, [.60, .82], [0, 1]);
  const rise = useTransform(progress, [.52, .88], [100, 0]);
  const titleScale = useTransform(progress, [.68, .94], [.78, 1]);
  const titleOpacity = useTransform(progress, [.68, .85], [0, 1]);
  const signShift = useTransform(progress, [.65, .96], [120, 0]);
  const leftShift = useTransform(signShift, value => -value);
  const driftState = useTransform(progress, value => value < .60 ? "paused" : "running");
  useEffect(() => {
    let visible = true;
    const update = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }, { threshold: 0.05 });
    observer.observe(scene.current);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);
  return (
    <motion.section ref={scene} id="home" className="mascot-poster" data-paused={!active || !!reduced}
      style={{ "--poster-drift-state": driftState }}>
      <img className="poster-background" src={MASCOT + "Gradient Fill 1.png"} alt="" draggable="false" fetchPriority="high" />
      <div className="poster-tint" />
      <motion.h1 className="poster-heading" style={{ opacity: entrance, y: reduced ? 0 : leftShift }}>DHWANI ’26</motion.h1>
      <div className="poster-khai"><motion.img style={{ opacity: titleOpacity, scale: reduced ? 1 : titleScale }} src={MASCOT + "khai.png"} alt="Khai" draggable="false" /></div>
      <div className="poster-character">
        <motion.button className="poster-character-button" type="button" aria-label="Make Khai dance"
          style={{ opacity: entrance, y: reduced ? 0 : rise }}
          onClick={() => setTap(n => n + 1)} whileTap={reduced ? undefined : { scale: 0.97 }}>
          <motion.img key={tap} src={MASCOT + "mascot-main.svg"} alt="Khai, the Dhwani mascot" draggable="false"
            initial={false} animate={tap && !reduced ? { rotate: [0,-3,3,-1,0], y: [0,-14,0] } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.65, ease: "easeInOut" }} />
        </motion.button>
      </div>
      <motion.div className="poster-sign poster-sign-left" style={{ opacity: titleOpacity, x: reduced ? 0 : leftShift }}><img src={MASCOT + "sign-left.png"} draggable="false"
        alt="You don't find the carnival. The carnival finds you. And when the time comes, someone will show you the way in." /></motion.div>
      <motion.div className="poster-sign poster-sign-right" style={{ opacity: titleOpacity, x: reduced ? 0 : signShift }}><img src={MASCOT + "sign-right.png"} draggable="false"
        alt="Keep watching. You're closer than you think." /></motion.div>
      {CLOUDS.map(([file,position],i) => <motion.div className={"poster-cloud poster-cloud-"+position} key={position}
        style={{ opacity: titleOpacity, x: reduced ? 0 : (i%2 ? signShift : leftShift), "--float-time": 5+i*0.5+"s"}}>
        <img src={MASCOT+file} alt="" draggable="false" /></motion.div>)}
      <motion.div className="poster-foreground" style={{ opacity: entrance, y: reduced ? 0 : rise }}><img src={MASCOT+"cloud-main.png"} alt="" draggable="false" /></motion.div>
    </motion.section>
  );
}
function ScrollCloud({ index, progress }) {
  const reduced = useReducedMotion();
  const left = index % 2 === 0;
  const x = useTransform(progress, [0, .05, .60], ["0%", "0%", left ? "-150%" : "150%"]);
  const y = useTransform(progress, [0, .60], ["0%", index < 2 ? "-28%" : "18%"]);
  return <motion.div className={`cloud-curtain-layer curtain-${index}`} style={reduced ? undefined : { x, y }}>
    <img src={`/assets/curtain/${2 + index % 6}.png`} alt="" draggable="false" />
  </motion.div>;
}

function CloudJourney() {
  const track = useRef(null);
  useLayoutEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  // One shared, reversible timeline; no per-frame React state or remounts.
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 220, damping: 34, mass: .45, restDelta: .0001 });
  const progress = reduced ? scrollYProgress : smoothProgress;
  const opacity = useTransform(progress, [0, .08, .30], [1, 1, 0]);
  const prompt = useTransform(progress, [0, .2], [1, 0]);
  const promptEvents = useTransform(progress, value => value < .2 ? "auto" : "none");
  const curtainVisibility = useTransform(progress, value => value >= .60 ? "hidden" : "visible");
  const promptVisibility = useTransform(progress, value => value >= .20 ? "hidden" : "visible");
  const cover = useTransform(progress, [0, .48, .60], [1, 1, 0]);
  const skip = () => window.scrollTo({ top: track.current.offsetTop + track.current.offsetHeight - window.innerHeight, behavior: reduced ? "instant" : "smooth" });
  return <div ref={track} className="cloud-journey">
    <div className="cloud-journey-sticky">
      <KhaiHero progress={progress} />
      <motion.div className="cloud-curtain" style={{ opacity: reduced ? opacity : cover, visibility: curtainVisibility }} aria-hidden="true">
        <motion.div className="cloud-curtain-ground" style={{ opacity }} />
        {Array.from({ length: 10 }, (_, index) => <ScrollCloud key={index} index={index} progress={progress} />)}
      </motion.div>
      <motion.button className="cloud-scroll-prompt" style={{ opacity: prompt, pointerEvents: promptEvents, visibility: promptVisibility }} onClick={skip}>SCROLL TO MEET KHAI <span>↓</span></motion.button>
    </div>
  </div>;
}

export default function HeroReveal({ onRevealComplete }) {
  const [phase,setPhase] = useState("gates");
  const reduced = useReducedMotion();
  const finished = useRef(false);
  useEffect(() => {
    for (let n = 2; n <= 7; n++) { const img = new Image(); img.src = `/assets/curtain/${n}.png`; }
  }, []);
  useEffect(() => {
    const previous = document.body.style.overflow;
    if (phase !== "hero") document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [phase]);
  const showHero = () => {
    if (finished.current) return;
    finished.current = true;
    setPhase("hero");
    onRevealComplete?.();
  };
  return <section className="hero-reveal-shell"><AnimatePresence mode="wait">
    {phase === "gates" && <Gates key="gates" onEnter={() => { if(reduced) showHero(); else setPhase("mask"); }} />}
    {phase === "mask" && <MaskReveal key="mask" onComplete={showHero} />}
    {phase === "hero" && <CloudJourney key="hero" />}
  </AnimatePresence></section>;
}
