import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import OptionWheel from "./OptionWheel";
import "./Navigation.css";

function Brand() {
  return <div className="nav-brand">
    <img src="/assets/logo/dhwani-main.png" alt="Dhwani '26" />
    <div><strong>Oct 2, 3, 4 · 2026</strong><span>College of Engineering, Trivandrum</span></div>
  </div>;
}

export default function SideNavbar() {
  const [open, setOpen] = useState(false);
  const panel = useRef(null), trigger = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => panel.current?.querySelector("button")?.focus());
    const keyboard = event => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;
      const items = panel.current?.querySelectorAll("a[href],button,summary");
      if (!items?.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", keyboard);
    return () => {
      cancelAnimationFrame(frame); document.body.style.overflow = previous;
      document.removeEventListener("keydown", keyboard); trigger.current?.focus();
    };
  }, [open]);
  const goTo = (event, href) => {
    event.preventDefault(); setOpen(false);
    requestAnimationFrame(() => requestAnimationFrame(() => document.querySelector(href)?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" })));
  };
  return <>
    <header className="nav-topbar">
      <Brand />
      <button
        ref={trigger}
        className="nav-toggle"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="festival-navigation"
        onClick={() => setOpen(o => !o)}
      >
        <span /><span />
      </button>
    </header>
    <AnimatePresence>
      {open && (
        <motion.aside
          ref={panel}
          id="festival-navigation"
          className="nav-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Festival navigation"
          initial={{ x: reduced ? 0 : "100%", opacity: reduced ? 0 : 1 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: reduced ? 0 : "100%", opacity: reduced ? 0 : 1 }}
          transition={{ duration: reduced ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="nav-sheet-top">
            <Brand />
            <button className="nav-close" aria-label="Close navigation" onClick={() => setOpen(false)}>
              ×
            </button>
          </div>
          <div className="nav-sheet-wheel">
            <OptionWheel
              items={['Ambient', 'House', 'Techno', 'Jazz', 'Lo-Fi', 'Synthwave']}
              defaultSelected={2}
              textColor="#a6a6a6"
              activeColor="#7C3AED"
              side="right"
              fontSize={3}
              spacing={2.45}
              curve={2}
              tilt={12}
              blur={2}
              fade={0.25}
              smoothing={360}
              inset={204}
              loop={false}
              draggable
              soundUrl="/sounds/click-soft.mp3"
              soundVolume={0.5}
              onChange={(index, item) => console.log(index, item)}
            />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  </>;
}