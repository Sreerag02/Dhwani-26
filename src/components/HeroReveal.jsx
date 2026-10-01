import useSceneActive from "../hooks/useSceneActive";
import { useRef } from "react";
import { motion, useAnimationControls, useReducedMotion, useTransform } from "motion/react";
import KhaiPuppet from "./KhaiPuppet";
import "./MascotHero.css";
const MASCOT = "/assets/mascot/";
const CLOUDS = [["cloud-left.webp","one"],["cloud-rightup.webp","two"],["cloud-1.webp","three"],["cloud-leftup.webp","four"],["cloud-2.webp","five"],["cloud-leftup.webp","six"]];
export default function KhaiHero({ progress, sceneProgress }) {
  const scene = useRef(null);
  const active = useSceneActive(scene, sceneProgress, .403, .700);
  const dance = useAnimationControls();
  const reduced = useReducedMotion();
  const entrance = useTransform(progress, [.60, .82], [0, 1]);
  const rise = useTransform(progress, [.52, .88], [100, 0]);
  const titleScale = useTransform(progress, [.68, .94], [.78, 1]);
  const titleOpacity = useTransform(progress, [.68, .85], [0, 1]);
  const signShift = useTransform(progress, [.65, .96], [120, 0]);
  const leftShift = useTransform(signShift, value => -value);
  const driftState = useTransform(progress, value => value < .60 ? "paused" : "running");
  return (
    <motion.section ref={scene} id="home" className="mascot-poster" data-paused={!active || !!reduced}
      style={{ "--poster-drift-state": driftState }}>
      <picture>
        <source media="(max-width:700px) and (max-aspect-ratio:1/1)" srcSet={MASCOT + "Gradient%20Fill%202.webp"} />
        <img decoding="async" className="poster-background" src={MASCOT + "Gradient Fill 1.webp"} alt="" draggable="false" />
      </picture>
      <div className="poster-tint" />
      <div className="poster-khai"><motion.img decoding="async" style={{ opacity: titleOpacity, scale: reduced ? 1 : titleScale }} src={MASCOT + "khai.webp"} alt="Khai" draggable="false" /></div>
      <div className="poster-character">
<motion.button className="poster-character-button" type="button" aria-label="Make Khai dance"
            style={{ opacity: entrance, y: reduced ? 0 : rise, scale: 1 }}
            onClick={() => {
              if (reduced) return;
              dance.stop();
              dance.start({ rotate: [0, -3, 3, -1, 0], y: [0, -14, 0] });
            }}
            whileTap={reduced ? undefined : { scale: 0.97 }}>
            <motion.div className="poster-character-wrap"
              initial={false}
              animate={reduced ? { rotate: 0, y: 0 } : dance}
              transition={{ duration: 0.65, ease: "easeInOut" }}>
              <KhaiPuppet progress={progress} reduced={reduced} />
            </motion.div>
          </motion.button>
      </div>
      <motion.div className="poster-sign poster-sign-left" style={{ opacity: titleOpacity, x: reduced ? 0 : leftShift }}><img decoding="async" src={MASCOT + "sign-left.webp"} alt="You don’t find the carnival. The carnival finds you. And when the time comes, someone will show you the way in." draggable="false" /></motion.div>
      <motion.div className="poster-sign poster-sign-right" style={{ opacity: titleOpacity, x: reduced ? 0 : signShift }}><img decoding="async" src={MASCOT + "sign-right.webp"} alt="Keep watching. You’re closer than you think." draggable="false" /></motion.div>
      {CLOUDS.map(([file,position],i) => <motion.div className={"poster-cloud poster-cloud-"+position} key={position}
        style={{ opacity: titleOpacity, x: reduced ? 0 : (i%2 ? signShift : leftShift), "--float-time": 5+i*0.5+"s"}}>
        <img decoding="async" src={MASCOT+file} alt="" draggable="false" /></motion.div>)}
      <motion.div className="poster-foreground" style={{ opacity: entrance, y: reduced ? 0 : rise }}><img decoding="async" src={MASCOT+"cloud-main.webp"} alt="" draggable="false" /></motion.div>
      <motion.a
        className="poster-game-cta"
        href="https://game.dhwanicet.com"
        target="_blank"
        rel="noreferrer"
        style={{ opacity: entrance, y: reduced ? 0 : rise }}
      >
        Play the Game
      </motion.a>
    </motion.section>
  );
}
