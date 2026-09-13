import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const LOGO = "/assets/logo/";

export default function SideNavbar() {
  const [open, setOpen] = useState(false);
  const trigger = useRef(null);
  const panel = useRef(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focus = requestAnimationFrame(() => panel.current?.querySelector("button")?.focus());
    const keyboard = (event) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;
      const items = panel.current?.querySelectorAll("a[href],button");
      if (!items?.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", keyboard);
    return () => { cancelAnimationFrame(focus); document.body.style.overflow = previous; document.removeEventListener("keydown", keyboard); trigger.current?.focus(); };
  }, [open]);

  const links = [
    {
      number: "01",
      label: "HOME",
      href: "#home",
    },
    {
      number: "02",
      label: "THEME",
      href: "#theme-reveal",
    },
    {
      number: "03",
      label: "DATE",
      href: "#date-reveal",
    },
    {
      number: "04",
      label: "ABOUT CET",
      href: "#about-cet",
    },
    {
      number: "05",
      label: "EVENTS",
      href: "#events",
    },
    {
      number: "06",
      label: "SPONSORS",
      href: "#sponsors",
    },
  ];

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <>
      <header className="festival-header">
        <a href="#home" className="festival-header-logo" aria-label="Dhwani home"><img src={`${LOGO}dhwani-main.png`} alt="Dhwani ’26" /></a>
        <div className="festival-header-details"><strong>OCT 2, 3, 4 · 2026</strong><span>College of Engineering, Trivandrum</span></div>
      <motion.button
        ref={trigger}
        type="button"
        className="festival-menu-button"
        aria-label="Open navigation"
        aria-expanded={open}
        aria-controls="festival-navigation"
        onClick={() => setOpen(true)}
        initial={{
          x: 80,
          opacity: 0,
        }}
        animate={{
          x: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.7,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <span />
        <span />
        <span />
      </motion.button>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              className="side-nav-overlay"
              aria-label="Close navigation"
              onClick={closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            <motion.aside
              ref={panel}
              id="festival-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Festival navigation"
              className="side-nav"
              initial={{ x: "110%" }}
              animate={{ x: 0 }}
              exit={{ x: "110%" }}
              transition={{
                duration: 0.55,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              <div className="side-nav__header">
                <img
                  src={`${LOGO}dhwani-main.png`}
                  alt="Dhwani 26"
                  draggable="false"
                />

                <button
                  type="button"
                  aria-label="Close navigation"
                  onClick={closeMenu}
                >
                  ×
                </button>
              </div>

              <nav className="side-nav__links">
                {links.map((link, index) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={closeMenu}
                    initial={{
                      opacity: 0,
                      x: 25,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: 0.1 + index * 0.06,
                    }}
                  >
                    <span>{link.number}</span>
                    <strong>{link.label}</strong>
                    <i>→</i>
                  </motion.a>
                ))}
              </nav>

              <a
                className="side-nav__ticket"
                href="#tickets"
                onClick={closeMenu}
              >
                GET TICKETS
              </a>
              <a className="poster-font-credit" href="https://www.onlinewebfonts.com"
                target="_blank" rel="noreferrer">Fonts: Online Web Fonts · CC BY 4.0</a>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
