import "./Merch.css";
import { motion, useReducedMotion, useTransform } from "motion/react";

export default function Merch({ progress }) {
  const reduced = useReducedMotion();
  // Pop-in driven by the journey's reveal window: a minimal, gentle pop —
  // each element scales up slightly with a tiny overshoot and lifts a few px,
  // all via the stage's CSS vars (--pop/--rise/--fade) composed through
  // independent props so the elements' own transforms stay untouched.
  const enter = useTransform(progress, [.96, .995], [0, 1]);
  const scale = useTransform(enter, [0, .5, 1], [.94, 1.02, 1]);
  const rise = useTransform(enter, [0, 1], ["10px", "0px"]);
  return (
    <section id="merch" className="merch" aria-label="Dhwani 26 merchandise">
      <motion.div
        className="merch__stage"
        style={reduced ? undefined : { "--pop": scale, "--rise": rise, "--fade": enter }}
      >
        {/* <div className="merch__bg merch__bg--blue" aria-hidden="true" /> */}
        <div className="merch__bg merch__bg--pink" aria-hidden="true" />
        <img
          src="/assets/dhwani og 26.png"
          alt="Dhwani 26"
          className="merch__logo"
          draggable="false"
        />
        <img
          src="/assets/tshirt outlne.png"
          alt=""
          className="merch__tee merch__tee--outline"
          draggable="false"
        />
        <img
          src="/assets/t shirt back.png"
          alt="Dhwani 26 t-shirt back"
          className="merch__tee merch__tee--back"
          draggable="false"
        />
        <img
          src="/assets/GET YOUR TEES NOWWW!1.png"
          alt="Get your tees now"
          className="merch__tees-now"
          draggable="false"
        />
        <img
          src="/assets/t shirt front copy.png"
          alt="Dhwani 26 t-shirt front"
          className="merch__tee merch__tee--front-left"
          draggable="false"
        />
        <img
          src="/assets/merch/cloud/cloud3.png"
          alt=""
          className="merch__cloud--left-btm"
          draggable="false"
        />
        <img
          src="/assets/merch/cloud/cloud3.png"
          alt=""
          className="merch__cloud--left-mid"
          draggable="false"
        />
        <img
          src="/assets/merch/cloud/Cloud7.png"
          alt=""
          className="merch__cloud--right-mid"
          draggable="false"
        />
        <img
          src="/assets/t shirt front copy.png"
          alt="Dhwani 26 t-shirt front"
          className="merch__tee merch__tee--front-right"
          draggable="false"
        />
        <img
          src="/assets/merch/lantern/L2 copy.png"
          alt=""
          className="merch__lantern merch__lantern--l2"
          draggable="false"
        />
        <img
          src="/assets/merch/lantern/lantern.png"
          alt=""
          className="merch__lantern merch__lantern--plain"
          draggable="false"
        />
        <img
          src="/assets/merch/lantern/lantern3.png"
          alt=""
          className="merch__lantern merch__lantern--three"
          draggable="false"
        />
        <img
          src="/assets/merch/lantern/lantern 2.png"
          alt=""
          className="merch__lantern"
          draggable="false"
        />
        <a href="#merch" className="merch__order-btn" role="button">
          Order Now
        </a>
      </motion.div>
    </section>
  );
}

export function MerchKit() {
  return (
    <div className="merch-kit">
      <img
        src="/assets/MERCH KIT IMAGE.png"
        alt="Dhwani 26 merch kit"
        className="merch-kit__image"
        draggable="false"
      />
      <img
        src="/assets/merch kit.png"
        alt="Merch kit"
        className="merch-kit__label"
        draggable="false"
      />
    </div>
  );
}