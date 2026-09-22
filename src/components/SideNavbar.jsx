import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import OptionWheel from "./OptionWheel";
import "./Navigation.css";

const NAV_ITEMS = ['Theme', 'Khai', 'Merch', 'Events', 'Campus Ambassador', 'Coming Soon'];
const NAV_HREFS = { 'Theme': '#theme-reveal', 'Khai': '#khai', 'Merch': '#merch', 'Events': '#events', 'Campus Ambassador': '#campus-ambassador', 'Coming Soon': '#coming-soon' };
const NAV_HREFS_ORDER = NAV_ITEMS.map(item => NAV_HREFS[item]);

function Brand() {
  return <div className="nav-brand">
    <img src="/assets/logo/dhwani-text.webp" alt="Dhwani '26" />
    <div><strong>Oct 2, 3, 4 · 2026</strong><span>College of Engineering, Trivandrum</span></div>
  </div>;
}

export default function SideNavbar() {
  const [open, setOpen] = useState(false);
  const [afterMerch, setAfterMerch] = useState(false);
  const [activeIndex, setActiveIndex] = useState(3);
  const panel = useRef(null), trigger = useRef(null);
  const reduced = useReducedMotion();
  const lenis = useLenis();

  // Scroll-spy + gate: navbar shows only once the merch section is reached.
  useEffect(() => {
    const getIndex = () => {
      const threshold = window.scrollY + window.innerHeight * 0.3;
      let idx = 0;
      NAV_HREFS_ORDER.forEach((sel, i) => {
        const el = document.querySelector(sel);
        if (el && el.getBoundingClientRect().top + window.scrollY <= threshold) idx = i;
      });
      return idx;
    };
    const update = () => {
      setActiveIndex(getIndex());
      const merch = document.querySelector('#merch');
      setAfterMerch(!!merch && merch.getBoundingClientRect().top + window.scrollY <= window.scrollY + window.innerHeight * 0.3);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

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
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (lenis) {
        lenis.scrollTo(href, { duration: reduced ? 0 : 1.2 });
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
      }
    }));
  };
  return <>
    <header className={`nav-topbar${afterMerch ? "" : " nav-topbar--hidden"}`}>
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
          <div className="nav-sheet-wheel" data-lenis-prevent>
            <OptionWheel
              items={NAV_ITEMS}
              defaultSelected={activeIndex}
              selected={activeIndex}
              textColor="#a6a6a6"
              activeColor="#ffffff"
              side="right"
              fontSize={3}
              spacing={1.4}
              curve={1}
              tilt={6}
              blur={0}
              fade={0.05}
              minOpacity={0.85}
              smoothing={200}
              inset={80}
              loop={false}
              draggable
              soundUrl="/sounds/click-soft.mp3"
              soundVolume={0.5}
              onChange={(index, item) => {
                setActiveIndex(index);
                const href = NAV_HREFS[item];
                if (href) goTo({ preventDefault() {} }, href);
              }}
            />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  </>;
}