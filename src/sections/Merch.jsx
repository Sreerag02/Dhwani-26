import "./Merch.css";
import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useTransform } from "motion/react";

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
        <img src="/assets/footer/yellowbadge.webp" alt="" className="merch__tooltip-badge" draggable="false" />
        <span className="merch__tooltip-text">{label}</span>
      </div>
    </div>
  );
}

/** Scroll-driven merch pop-in item.
 *
 * Breaks the fragile CSS-calc choreography out of Merch.css and drives the
 * per-item transforms straight from the shared `phase2` (enter) scroll
 * MotionValue. Each wrapper still reads its own --fly-* / --base-rot /
 * --pop-delay custom properties (set per item in the stylesheet, including
 * portrait overrides) so positioning and travel stay defined in CSS; only the
 * arithmetic moves to JS where it's bulletproof. */
function MerchPop({ phase2, className, style, src, alt, reduced }) {
  const wrapRef = useRef(null);
  const [tween, setTween] = useState(null);

  useLayoutEffect(() => {
    const read = () => {
      const el = wrapRef.current;
      if (!el) return;
      const cs = getComputedStyle(el);
      const num = (name, fallback = 0) => {
        const v = parseFloat(cs.getPropertyValue(name));
        return Number.isFinite(v) ? v : fallback;
      };
      setTween({
        flyX: num("--fly-x"),
        flyY: num("--fly-y"),
        flyRot: num("--fly-rot"),
        baseRot: num("--base-rot"),
        delay: num("--pop-delay", 0.3),
      });
    };
    read();
    window.addEventListener("resize", read);
    window.addEventListener("orientationchange", read);
    return () => {
      window.removeEventListener("resize", read);
      window.removeEventListener("orientationchange", read);
    };
  }, []);

  // Staggered entrance: each item's --pop-delay shifts its slice of phase2.
  // The items hold their settled composition through the rest of the pin —
  // there is no scatter-out, so the stage never empties before Events arrives.
  // `tween` (a plain object from state) is only ever captured in the
  // transformer closures — the useTransform inputs stay MotionValues.
  const enter = useTransform([phase2], ([p]) => {
    const delay = (tween && tween.delay) ?? 0.3;
    const s = Math.min(delay * 1.0, 0.7);
    return Math.min(Math.max((p - s) / 0.3, 0), 1);
  });
  const x = useTransform([enter], ([e]) => {
    const f = tween ?? {};
    return `${((f.flyX ?? 0) * (1 - e)).toFixed(2)}cqw`;
  });
  const y = useTransform([enter], ([e]) => {
    const f = tween ?? {};
    return `${((f.flyY ?? 0) * (1 - e)).toFixed(2)}cqw`;
  });
  const rotate = useTransform([enter], ([e]) => {
    const f = tween ?? {};
    return `${((f.baseRot ?? 0) + (f.flyRot ?? 0) * (1 - e)).toFixed(2)}deg`;
  });
  const scale = useTransform([enter], ([e]) => {
    return Math.max(0.001, e < 0.55 ? 0.35 + (1.06 - 0.35) * (e / 0.55) : 1.06 - (1.06 - 1) * ((e - 0.55) / 0.45));
  });
  const opacity = useTransform([enter], ([e]) => e);

  return (
    <div ref={wrapRef} className={className} style={style}>
      {reduced ? (
        <img src={src} alt={alt} aria-hidden="true" draggable="false" />
      ) : (
        <motion.div className="merch__pop-move" style={{ x, y, rotate, scale, opacity }}>
          <img src={src} alt={alt} aria-hidden="true" draggable="false" />
        </motion.div>
      )}
    </div>
  );
}

export default function Merch({ progress }) {
  const reduced = useReducedMotion();
  const [cta, setCta] = useState(() => (
    progress.get() >= 0.945
      ? { label: "Shop Merch", href: "https://makemypass.com/event/dhwani-merch" }
      : { label: "Buy Tees", href: "https://makemypass.com/event/dhwani-26-tee" }
  ));
  useMotionValueEvent(progress, "change", value => {
    setCta(value >= 0.945
      ? { label: "Shop Merch", href: "https://makemypass.com/event/dhwani-merch" }
      : { label: "Buy Tees", href: "https://makemypass.com/event/dhwani-26-tee" });
  });
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
  // bandanas, fannies, kit — pop out around the tees. Each MerchPop item
  // staggers its own entrance via --pop-delay within the shared phase2 window.
  const bgShift = useTransform(progress, [.90, .96], [1, 0]);
  const phase2 = useTransform(progress, [.90, .965], [0, 1]);
  // Scene 2: the "t-shirt scene" gives way to the merch display — clouds,
  // lanterns and notes drift out (--decor), the tees fade away completely
  // (--tees), and the merch box pops into the centre (--box/--boxScale)
  // while the merch items pop in via the MerchPop layer each driving its own
  // staggered window of phase2. They settle by ~.965 and hold that settled
  // composition through the rest of the pin — no scatter-out, so the stage
  // never empties before the journey hands off to the Events section.
  const decorOut = useTransform(progress, [.90, .945], [1, 0]);
  const teesOut = useTransform(progress, [.90, .945], [1, 0]);
  const boxIn = useTransform(progress, [.905, .96], [0, 1]);
  const boxScale = useTransform(boxIn, v => 0.72 + 0.28 * v);
  const ctaY = useTransform(progress, [.90, .945, .965], ["-8svh", "-8svh", "7svh"]);
  return (
    <motion.section
      id="merch"
      className="merch"
      aria-label="Dhwani 26 merchandise"
      style={reduced ? undefined : { "--pop": scale, "--rise": rise, "--fade": enter, "--bgshift": bgShift, "--decor": decorOut, "--tees": teesOut, "--box": boxIn, "--boxScale": boxScale }}
    >
      <div className="merch__bg merch__bg--blue" aria-hidden="true" />
      <div className="merch__bg merch__bg--pink" aria-hidden="true" />
      <img
        src="/assets/merch/bg/bg element.webp"
        alt=""
        aria-hidden="true"
        className="merch__bg-element"
        draggable="false"
      />
      <div className="merch__stage">
        <img
          src="/assets/merch/merch.webp"
          alt="Dhwani 26"
          className="merch__logo"
          draggable="false"
        />
        <motion.div className="merch__tees">
          <img
            src="/assets/tshirt outlne.webp"
            alt=""
            className="merch__tee merch__tee--outline"
            draggable="false"
          />
          <img
            src="/assets/t shirt back.webp"
            alt="Dhwani 26 t-shirt back"
            className="merch__tee merch__tee--back"
            draggable="false"
          />
          <img
            src="/assets/GET YOUR TEES NOWWW!1.webp"
            alt="Get your tees now"
            className="merch__tees-now"
            draggable="false"
          />
          <img
            src="/assets/t shirt front copy.webp"
            alt="Dhwani 26 t-shirt front"
            className="merch__tee merch__tee--front-left"
            draggable="false"
          />
          <img
            src="/assets/t shirt front copy.webp"
            alt="Dhwani 26 t-shirt front"
            className="merch__tee merch__tee--front-right"
            draggable="false"
          />
        </motion.div>

        {/* <img
          src="/assets/MERCH KIT IMAGE.webp"
          alt="Dhwani 26 merch collection"
          className="merch__box"
          draggable="false"
        /> */}
        <img
          src="/assets/merch/cloud/cloud3.webp"
          alt=""
          className="merch__cloud--left-btm"
          draggable="false"
        />
        <img
          src="/assets/merch/cloud/cloud3.webp"
          alt=""
          className="merch__cloud--left-mid"
          draggable="false"
        />
        <img
          src="/assets/merch/cloud/Cloud7.webp"
          alt=""
          className="merch__cloud--right-mid"
          draggable="false"
        />
        <img
          src="/assets/merch/cloud/cloud2.webp"
          alt=""
          className="merch__cloud--top-left"
          draggable="false"
        />
        <img
          src="/assets/merch/cloud/cloud5.webp"
          alt=""
          className="merch__cloud--top-right"
          draggable="false"
        />
        <img
          src="/assets/merch/cloud/cloud1.webp"
          alt=""
          className="merch__cloud--low-right"
          draggable="false"
        />
        <img
          src="/assets/merch/cloud/cloud4.webp"
          alt=""
          className="merch__cloud--bottom-left"
          draggable="false"
        />
        <img
          src="/assets/merch/cloud/cloud.webp"
          alt=""
          className="merch__cloud--bottom-mid"
          draggable="false"
        />
        <img
          src="/assets/merch/cloud/cloud6.webp"
          alt=""
          className="merch__cloud--bottom-right"
          draggable="false"
        />
        <img
          src="/assets/merch/cloud/Cloud7.webp"
          alt=""
          className="merch__cloud--bottom-right-low"
          draggable="false"
        />
        <img
          src="/assets/blue note.webp"
          alt=""
          className="merch__note--blue"
          draggable="false"
        />
        <img
          src="/assets/note red.webp"
          alt=""
          className="merch__note--red"
          draggable="false"
        />
        <img
          src="/assets/merch/lantern/L2 copy.webp"
          alt=""
          className="merch__lantern merch__lantern--l2"
          draggable="false"
        />
        <img
          src="/assets/merch/lantern/lantern.webp"
          alt=""
          className="merch__lantern merch__lantern--plain"
          draggable="false"
        />
        <img
          src="/assets/merch/lantern/lantern3.webp"
          alt=""
          className="merch__lantern merch__lantern--three"
          draggable="false"
        />
        <img
          src="/assets/merch/lantern/lantern 2.webp"
          alt=""
          className="merch__lantern"
          draggable="false"
        />
        <img
          src="/assets/merch/lantern/lantern1.webp"
          alt=""
          className="merch__lantern merch__lantern--one"
          draggable="false"
        />
        <MerchPop phase2={phase2} reduced={reduced}
          className="merch__pop merch__badge merch__badge--1" style={{ "--pop-delay": ".05s" }}
          src="/assets/merch/badges/badge%201.webp" alt="" />
        <MerchPop phase2={phase2} reduced={reduced}
          className="merch__pop merch__badge merch__badge--2" style={{ "--pop-delay": ".35s" }}
          src="/assets/merch/badges/badge%202.webp" alt="" />
        <MerchPop phase2={phase2} reduced={reduced}
          className="merch__pop merch__badge merch__badge--3" style={{ "--pop-delay": ".55s" }}
          src="/assets/merch/badges/badge%203.webp" alt="" />
        <MerchPop phase2={phase2} reduced={reduced}
          className="merch__pop merch__sticker merch__sticker--1" style={{ "--pop-delay": ".15s" }}
          src="/assets/merch/sticker/sticker1.png" alt="" />
        <MerchPop phase2={phase2} reduced={reduced}
          className="merch__pop merch__sticker merch__sticker-title" style={{ "--pop-delay": ".55s" }}
          src="/assets/merch/sticker/sticker.png" alt="" />
        <MerchPop phase2={phase2} reduced={reduced}
          className="merch__pop merch__sticker merch__sticker--2" style={{ "--pop-delay": ".3s" }}
          src="/assets/merch/sticker/sticker2.png" alt="" />
        <MerchPop phase2={phase2} reduced={reduced}
          className="merch__pop merch__sticker merch__sticker--3" style={{ "--pop-delay": ".45s" }}
          src="/assets/merch/sticker/sticker3.png" alt="" />
        <MerchPop phase2={phase2} reduced={reduced}
          className="merch__pop merch__sticker merch__sticker--4" style={{ "--pop-delay": ".6s" }}
          src="/assets/merch/sticker/sticker4.png" alt="" />
        <MerchPop phase2={phase2} reduced={reduced}
          className="merch__pop merch__sticker merch__sticker--5" style={{ "--pop-delay": ".75s" }}
          src="/assets/merch/sticker/sticker5.png" alt="" />
        <MerchPop phase2={phase2} reduced={reduced}
          className="merch__pop merch__bandana merch__bandana--1" style={{ "--pop-delay": ".12s" }}
          src="/assets/merch/bandana/bandana%201.webp" alt="" />
        <MerchPop phase2={phase2} reduced={reduced}
          className="merch__pop merch__bandana merch__bandana--2" style={{ "--pop-delay": ".4s" }}
          src="/assets/merch/bandana/bandana%202.webp" alt="" />
        {/* <MerchPop phase2={phase2} reduced={reduced}
          className="merch__pop merch__bandana merch__bandana--3" style={{ "--pop-delay": ".65s" }}
          src="/assets/merch/bandana/bandana-a2.webp" alt="" /> */}
        <MerchPop phase2={phase2} reduced={reduced}
          className="merch__pop merch__bandana merch__bandana--wide" style={{ "--pop-delay": ".5s" }}
          src="/assets/merch/bandana.webp" alt="" />
        <MerchPop phase2={phase2} reduced={reduced}
          className="merch__pop merch__fanny merch__fanny--right" style={{ "--pop-delay": ".58s" }}
          src="/assets/merch/fanny-pack.webp" alt="" />
        <MerchPop phase2={phase2} reduced={reduced}
          className="merch__pop merch__badge merch__badge--wide" style={{ "--pop-delay": ".66s" }}
          src="/assets/merch/badges.webp" alt="" />
        <MerchPop phase2={phase2} reduced={reduced}
          className="merch__pop merch__fanny merch__fanny--1" style={{ "--pop-delay": ".2s" }}
          src="/assets/merch/fanny/fanny-1.webp" alt="" />
        <MerchPop phase2={phase2} reduced={reduced}
          className="merch__pop merch__fanny merch__fanny--2" style={{ "--pop-delay": ".45s" }}
          src="/assets/merch/fanny/fanny-2.webp" alt="" />
        <MerchPop phase2={phase2} reduced={reduced}
          className="merch__pop merch__kit" style={{ "--pop-delay": ".55s" }}
          src="/assets/merch/merch-kit.png" alt="" />
        <MerchPop phase2={phase2} reduced={reduced}
          className="merch__pop merch__kit-title" style={{ "--pop-delay": ".55s" }}
          src="/assets/merch/merch-kit-title.png" alt="" />
        {/* <MerchItem className="merch__pop merch__badge merch__badge--1" style={{ "--pop-delay": ".05s" }}
          src="/assets/merch/badges/badge%201.png" label="Badge" />
        <MerchItem className="merch__pop merch__badge merch__badge--2" style={{ "--pop-delay": ".35s" }}
          src="/assets/merch/badges/badge%202.webp" label="Badge" />
        <MerchItem className="merch__pop merch__badge merch__badge--3" style={{ "--pop-delay": ".55s" }}
          src="/assets/merch/badges/badge%203.webp" label="Badge" />
        <MerchItem className="merch__pop merch__bandana merch__bandana--1" style={{ "--pop-delay": ".12s" }}
          src="/assets/merch/bandana/bandana%201.webp" label="Bandana" />
        <MerchItem className="merch__pop merch__bandana merch__bandana--2" style={{ "--pop-delay": ".4s" }}
          src="/assets/merch/bandana/bandana%202.webp" label="Bandana" />
        <MerchItem className="merch__pop merch__bandana merch__bandana--3" style={{ "--pop-delay": ".65s" }}
          src="/assets/merch/bandana/bandana-a2.webp" label="Bandana" />
        <MerchItem className="merch__pop merch__fanny merch__fanny--1" style={{ "--pop-delay": ".2s" }}
          src="/assets/merch/fanny/fanny-1.webp" label="Fanny Pack" />
        <MerchItem className="merch__pop merch__fanny merch__fanny--2" style={{ "--pop-delay": ".45s" }}
          src="/assets/merch/fanny/fanny-2.webp" label="Fanny Pack" /> */}
        <motion.a
          href={cta.href}
          className={`merch__order-btn${cta.label === "Buy Tees" ? " merch__order-btn--tees" : ""}`}
          role="button"
          style={reduced ? undefined : { "--cta-y": ctaY }}
          layout="size"
          transition={{ layout: { type: "spring", stiffness: 420, damping: 28 } }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={cta.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.16 }}
            >
              {cta.label}
            </motion.span>
          </AnimatePresence>
        </motion.a>
      </div>
    </motion.section>
  );
}