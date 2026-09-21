import "./Merch.css";
import { motion, useReducedMotion, useTransform } from "motion/react";

export default function Merch({ progress }) {
  const reduced = useReducedMotion();
  // Pop-in driven by the journey's reveal window: a minimal, gentle pop —
  // each element scales up slightly with a tiny overshoot and lifts a few px,
  // all via the stage's CSS vars (--pop/--rise/--fade) composed through
  // independent props so the elements' own transforms stay untouched.
  const enter = useTransform(progress, [.678, .708], [0, 1]);
  const scale = useTransform(enter, [0, .5, 1], [.985, 1.004, 1]);
  const rise = useTransform(enter, [0, 1], ["6px", "0px"]);
  // Curtain tear: after the tees poster settles, an indigo panel carrying the
  // rest of the merch unrolls toward the left like a carpet (scaleX from the
  // right edge), holds as the section's own blocking background.
  const tearVisibility = useTransform(progress, value => value < .77 ? "hidden" : "visible");
  const tearRoll = useTransform(progress, [.77, .86], [0, 1]);
  return (
    <section id="merch" className="merch" aria-label="Dhwani 26 merchandise">
      <motion.div
        className="merch__stage"
        style={reduced ? undefined : { "--pop": scale, "--rise": rise, "--fade": enter }}
      >
        {/* <div className="merch__bg merch__bg--blue" aria-hidden="true" /> */}
        <div className="merch__bg merch__bg--pink" aria-hidden="true" />
        <img
          src="/assets/merch/bg/bg element.png"
          alt=""
          aria-hidden="true"
          className="merch__bg-element"
          draggable="false"
        />
        <img
          src="/assets/merch/merch.png"
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
          src="/assets/merch/cloud/cloud2.png"
          alt=""
          className="merch__cloud--top-left"
          draggable="false"
        />
        <img
          src="/assets/merch/cloud/cloud5.png"
          alt=""
          className="merch__cloud--top-right"
          draggable="false"
        />
        <img
          src="/assets/merch/cloud/cloud1.png"
          alt=""
          className="merch__cloud--low-right"
          draggable="false"
        />
        <img
          src="/assets/merch/cloud/cloud4.png"
          alt=""
          className="merch__cloud--bottom-left"
          draggable="false"
        />
        <img
          src="/assets/merch/cloud/cloud.png"
          alt=""
          className="merch__cloud--bottom-mid"
          draggable="false"
        />
        <img
          src="/assets/merch/cloud/cloud6.png"
          alt=""
          className="merch__cloud--bottom-right"
          draggable="false"
        />
        <img
          src="/assets/merch/cloud/Cloud7.png"
          alt=""
          className="merch__cloud--bottom-right-low"
          draggable="false"
        />
        <img
          src="/assets/blue note.png"
          alt=""
          className="merch__note--blue"
          draggable="false"
        />
        <img
          src="/assets/note red.png"
          alt=""
          className="merch__note--red"
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
        <img
          src="/assets/merch/lantern/lantern1.png"
          alt=""
          className="merch__lantern merch__lantern--one"
          draggable="false"
        />
        <a href="#merch" className="merch__order-btn" role="button">
          Order Now
        </a>
      </motion.div>
      <motion.div className="merch-tear" style={{ visibility: tearVisibility,
          scaleX: reduced ? 1 : tearRoll }} aria-label="More Dhwani 26 merchandise">
        <img className="merch-tear__bg-element" src="/assets/merch/bg/bg element.png"
          alt="" aria-hidden="true" draggable="false" />
        <div className="merch-tear__cta">
          <a href="#merch" className="merch-tear__btn" role="button">Grab Your Merch Now</a>
        </div>
        <img className="merch-tear__badge merch-tear__badge--1"
          src="/assets/merch/badges/badge%201.png" alt="" aria-hidden="true" draggable="false" />
        <img className="merch-tear__badge merch-tear__badge--2"
          src="/assets/merch/badges/badge%202.png" alt="" aria-hidden="true" draggable="false" />
        <img className="merch-tear__badge merch-tear__badge--3"
          src="/assets/merch/badges/badge%203.png" alt="" aria-hidden="true" draggable="false" />
        <img className="merch-tear__bandana merch-tear__bandana--1"
          src="/assets/merch/bandana/bandana%201.png" alt="" aria-hidden="true" draggable="false" />
        <img className="merch-tear__bandana merch-tear__bandana--2"
          src="/assets/merch/bandana/bandana%202.png" alt="" aria-hidden="true" draggable="false" />
        <img className="merch-tear__bandana merch-tear__bandana--3"
          src="/assets/merch/bandana/bandana-a2.webp" alt="" aria-hidden="true" draggable="false" />
        <img className="merch-tear__fanny merch-tear__fanny--1"
          src="/assets/merch/fanny/fanny-1.webp" alt="" aria-hidden="true" draggable="false" />
        <img className="merch-tear__fanny merch-tear__fanny--2"
          src="/assets/merch/fanny/fanny-2.webp" alt="" aria-hidden="true" draggable="false" />
        <img className="merch-tear__fanny merch-tear__fanny--3"
          src="/assets/merch/fanny/fanny-3.webp" alt="" aria-hidden="true" draggable="false" />
        <img className="merch-tear__kit" src="/assets/MERCH KIT IMAGE.png" alt="Merch collection"
          draggable="false" />
      </motion.div>
    </section>
  );
}