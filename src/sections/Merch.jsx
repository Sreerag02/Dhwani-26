import "./Merch.css";
import { useState } from "react";
import { motion, useReducedMotion, useTransform } from "motion/react";

/** Hoverable merch item — shows a yellow badge tooltip with the item name */
function MerchItem({ className, style, src, label, alt }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`merch__item-wrap ${className}`}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      role="img"
      aria-label={label}
    >
      <img src={src} alt={alt || label} draggable="false" />
      <div className={`merch__tooltip${hovered ? " merch__tooltip--visible" : ""}`}>
        <img src="/assets/footer/yellowbadge.png" alt="" className="merch__tooltip-badge" draggable="false" />
        <span className="merch__tooltip-text">{label}</span>
      </div>
    </div>
  );
}

export default function Merch({ progress }) {
  const reduced = useReducedMotion();
  // Pop-in driven by the journey's reveal window: right after the concentric
  // t-shirt tunnel the poster does a gentle pop — the stage blooms from the
  // screen centre (--pop) while its elements lift a few px (--rise) and fade
  // in (--fade), all via the stage's CSS vars so the elements' own transforms
  // and placements stay untouched.
  const enter = useTransform(progress, [.84, .875], [0, 1]);
  const scale = useTransform(enter, [0, .5, 1], [.985, 1.004, 1]);
  const rise = useTransform(enter, [0, 1], ["6px", "0px"]);
  // Pink -> blue: the pink backdrop melts away to reveal the blue image, the
  // t-shirt cluster slides over (teeShift), and the merch objects — badges,
  // bandanas, fannies, kit — pop out around the tees. Each .merch__pop item
  // staggers its own entrance via --pop-delay; --fade2/--rise2 drive the group.
  const bgShift = useTransform(progress, [.90, .96], [1, 0]);
  const teeShift = useTransform(progress, [.90, .97], [0, 1]);
  const shiftX = useTransform(teeShift, v => `${v * 12}px`);
  const shiftY = useTransform(teeShift, v => `${v * -16}px`);
  const phase2 = useTransform(progress, [.90, .965], [0, 1]);
  const fade2 = useTransform(phase2, [0, 1], [0, 1]);
  const pop2 = useTransform(phase2, [0, 1], [0, 1]);
  // Scene 2: the "t-shirt scene" gives way to the merch display — clouds,
  // lanterns and notes drift out (--decor), the tees fade away completely
  // (--tees), and the merch box pops into the centre (--box/--boxScale)
  // while the merch items pop in via --pop2/--fade2. Everything settles by
  // ~.965, leaving the rest of the scroll as a hold on the finished display.
  const decorOut = useTransform(progress, [.90, .945], [1, 0]);
  const teesOut = useTransform(progress, [.90, .945], [1, 0]);
  const boxIn = useTransform(progress, [.905, .96], [0, 1]);
  const boxScale = useTransform(boxIn, v => 0.72 + 0.28 * v);
  return (
    <motion.section
      id="merch"
      className="merch"
      aria-label="Dhwani 26 merchandise"
      style={reduced ? undefined : { "--pop": scale, "--rise": rise, "--fade": enter, "--fade2": fade2, "--pop2": pop2, "--bgshift": bgShift, "--decor": decorOut, "--tees": teesOut, "--box": boxIn, "--boxScale": boxScale }}
    >
      <div className="merch__bg merch__bg--blue" aria-hidden="true" />
      <div className="merch__bg merch__bg--pink" aria-hidden="true" />
      <img
        src="/assets/merch/bg/bg element.png"
        alt=""
        aria-hidden="true"
        className="merch__bg-element"
        draggable="false"
      />
      <div className="merch__stage">
        <img
          src="/assets/merch/merch.png"
          alt="Dhwani 26"
          className="merch__logo"
          draggable="false"
        />
        <motion.div className="merch__tees" style={{ x: reduced ? 0 : shiftX, y: reduced ? 0 : shiftY }}>
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
            src="/assets/t shirt front copy.png"
            alt="Dhwani 26 t-shirt front"
            className="merch__tee merch__tee--front-right"
            draggable="false"
          />
        </motion.div>
        <img
          src="/assets/MERCH KIT IMAGE.png"
          alt="Dhwani 26 merch collection"
          className="merch__box"
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
        <MerchItem className="merch__pop merch__badge merch__badge--1" style={{ "--pop-delay": ".05s" }}
          src="/assets/merch/badges/badge%201.png" label="Badge" />
        <MerchItem className="merch__pop merch__badge merch__badge--2" style={{ "--pop-delay": ".35s" }}
          src="/assets/merch/badges/badge%202.png" label="Badge" />
        <MerchItem className="merch__pop merch__badge merch__badge--3" style={{ "--pop-delay": ".55s" }}
          src="/assets/merch/badges/badge%203.png" label="Badge" />
        <MerchItem className="merch__pop merch__bandana merch__bandana--1" style={{ "--pop-delay": ".12s" }}
          src="/assets/merch/bandana/bandana%201.png" label="Bandana" />
        <MerchItem className="merch__pop merch__bandana merch__bandana--2" style={{ "--pop-delay": ".4s" }}
          src="/assets/merch/bandana/bandana%202.png" label="Bandana" />
        <MerchItem className="merch__pop merch__bandana merch__bandana--3" style={{ "--pop-delay": ".65s" }}
          src="/assets/merch/bandana/bandana-a2.webp" label="Bandana" />
        <MerchItem className="merch__pop merch__fanny merch__fanny--1" style={{ "--pop-delay": ".2s" }}
          src="/assets/merch/fanny/fanny-1.webp" label="Fanny Pack" />
        <MerchItem className="merch__pop merch__fanny merch__fanny--2" style={{ "--pop-delay": ".45s" }}
          src="/assets/merch/fanny/fanny-2.webp" label="Fanny Pack" />
        <a href="#merch" className="merch__order-btn" role="button">
          Order Now
        </a>
      </div>
    </motion.section>
  );
}