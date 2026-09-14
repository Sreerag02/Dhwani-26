import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import "./Navigation.css";

function Brand() {
  return <div className="nav-brand">
    <img src="/assets/logo/dhwani-main.png" alt="Dhwani ’26" />
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
    // Wait for body scroll lock cleanup before navigating.
    requestAnimationFrame(() => requestAnimationFrame(() => document.querySelector(href)?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" })));
  };
  return <>
    <header className="nav-topbar">
      <Brand />
      <button ref={trigger} className="nav-toggle" aria-label="Open navigation" aria-expanded={open} aria-controls="festival-navigation" onClick={() => setOpen(true)}><span /><span /></button>
    </header>
    <AnimatePresence>
      {open && <motion.aside ref={panel} id="festival-navigation" className="nav-sheet" role="dialog" aria-modal="true" aria-label="Festival navigation"
        initial={{ x: reduced ? 0 : "100%", opacity: reduced ? 0 : 1 }} animate={{ x: 0, opacity: 1 }} exit={{ x: reduced ? 0 : "100%", opacity: reduced ? 0 : 1 }} transition={{ duration: reduced ? .15 : .45, ease: [.22,1,.36,1] }}>
        <div className="nav-sheet-top"><Brand /><button className="nav-close" aria-label="Close navigation" onClick={() => setOpen(false)}>×</button></div>
        <nav className="nav-sheet-links" aria-label="Main">
          {[["Home","#world"],["The Carnival","#theme-reveal"],["Meet Khai","#khai"]].map(([label,href]) => <a key={href} href={href} onClick={event => goTo(event,href)}>{label}</a>)}
          <details><summary>About CET</summary><p>Dhwani is the cultural festival of the College of Engineering, Trivandrum.</p></details>
        </nav>
        <a className="nav-credit" href="https://www.onlinewebfonts.com" target="_blank" rel="noreferrer">Fonts: Online Web Fonts · CC BY 4.0</a>
      </motion.aside>}
    </AnimatePresence>
  </>;
}
