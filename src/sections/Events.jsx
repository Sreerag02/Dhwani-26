import useSceneActive from "../hooks/useSceneActive";
import TicketingPartner from "../components/TicketingPartner";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion, useMotionValue, useSpring } from "motion/react";
import { useLenis } from "lenis/react";
import "./Events.css";

const INITIAL_EVENTS = [
  {
    id: 1,
    title: "Spotlight",
    category: "Artist Showcase",
    pillar: true,
    ticketUrl: null,
    subEvents: [],
    subtitle: "Flagship event of CETalks",
    date: "Oct 3–4, 2026",
    venue: "Festival venue",
    prizeLabel: "Format",
    prize: "Artist showcase",
    image: "/assets/runtime/events-section/spotlight.webp",
    description: "Spotlight is the flagship event of CETalks — two days of artists taking the stage.",
    rules: ["Artist showcase", "Oct 3–4, 2026", "Line-up to be announced"],
    contact: "CETalks",
    initialPos: { x: 60, y: 250 },
    mobilePos: { x: 40, y: 180 },
    tilt: -1.8,
    cardStyle: "carnival-cyan"
  },
  {
    id: 2,
    title: "Antara",
    category: "Music Fest",
    pillar: true,
    subEvents: [
      { name: "Eastern Idol", ticketUrl: "https://makemypass.com/event/antara-1" },
      { name: "Western Idol", ticketUrl: "https://makemypass.com/event/antara-2" },
      { name: "Strings", ticketUrl: "https://makemypass.com/event/antara-4" },
      { name: "Unplugged", ticketUrl: "https://makemypass.com/event/antara-3" },
      { name: "Battle of Bands", ticketUrl: "https://makemypass.com/event/antara" }
    ],
    subtitle: "Eastern Idol • Western Idol • Strings • Unplugged • Battle of Bands",
    date: "Oct 2–4, 2026",
    venue: "Festival venues",
    prize: "Unplugged: Oct 3 • 09:00–12:00 | Battle of Bands: Oct 4 • 09:00–14:00",
    image: "/assets/runtime/events-section/antara fulll.webp",
    description: "A music fest spanning idol competitions, strings, unplugged performances, and a Battle of Bands.",
    rules: ["Eastern Idol prelims: 6 minutes", "Eastern Idol finals: 8 minutes", "Strings: 7 minutes per participant"],
    contact: "Festival Desk",
    initialPos: { x: 750, y: 230 },
    mobilePos: { x: 520, y: 160 },
    tilt: 1.8,
    cardStyle: "carnival-purple"
  },
  {
    id: 3,
    title: "Nadanta",
    category: "Dance Fest",
    pillar: true,
    subEvents: [
      { name: "Solo", ticketUrl: "https://makemypass.com/event/nadanta-1" },
      { name: "Duo", ticketUrl: "https://makemypass.com/event/nadanta" },
      { name: "Spot", ticketUrl: "https://makemypass.com/event/nadanta-2" },
      { name: "Dance Battle", ticketUrl: "https://makemypass.com/event/nadanta-4" },
      { name: "Workshop by Sidharth", ticketUrl: "https://makemypass.com/event/nadanta-5" }
    ],
    subtitle: "Solo • Duo • Spot • Dance Battle • Workshop",
    date: "Oct 2–4, 2026",
    venue: "Festival venues",
    prize: "Solo: Oct 2 • 09:00–23:30",
    image: "/assets/runtime/events-section/nadanta.webp",
    description: "A dance fest with solo, duo, spot, battle, and workshop experiences.",
    rules: ["Solo: Oct 2, 09:00–23:30", "Workshop by Sidharth", "Duo, Spot, and Dance Battle sub-events"],
    contact: "Festival Desk",
    initialPos: { x: 1200, y: 260 },
    mobilePos: { x: 860, y: 200 },
    tilt: -1.2,
    cardStyle: "carnival-blue"
  },
  {
    id: 4,
    title: "Dionysia",
    category: "Theatrical Fest",
    pillar: true,
    subEvents: [
      { name: "Movie Spoof", ticketUrl: "https://makemypass.com/event/moviespoof" },
      { name: "Mimicry", ticketUrl: "https://makemypass.com/event/dionysiamimicry" },
      { name: "Mime", ticketUrl: "https://makemypass.com/event/dhwanimime" },
      { name: "Mono Act", ticketUrl: "https://makemypass.com/event/dionysiamonoact" },
      { name: "Best Actor", ticketUrl: "https://makemypass.com/event/bestactor" },
      { name: "Street Play", ticketUrl: "https://makemypass.com/event/streetplay" },
      { name: "മിസ", ticketUrl: "https://makemypass.com/event/misa" }
    ],
    subtitle: "Theatrical fest",
    date: "Dates to be announced",
    venue: "Festival venue",
    prize: "Programme details to be announced",
    image: "/assets/runtime/events-section/dionysia.webp",
    description: "Dionysia is Dhwani's theatrical fest.",
    rules: ["Dates to be announced", "Theatrical fest"],
    contact: "Festival Desk",
    initialPos: { x: 780, y: 630 },
    mobilePos: { x: 540, y: 500 },
    tilt: -2.0,
    cardStyle: "carnival-orange"
  },
  {
    id: 5,
    title: "Nazaara",
    category: "Fashion Flagship Event",
    pillar: true,
    ticketUrl: "https://makemypass.com/event/nazaara",
    subtitle: "Fashion flagship event",
    date: "Oct 3 • 14:00–23:05",
    venue: "Festival venue",
    prize: "9h 5m programme",
    image: "/assets/runtime/events-section/NAZAARA wp.webp",
    description: "Dhwani's fashion flagship event, presented across a nine-hour programme.",
    rules: ["Oct 3 programme", "14:00–23:05", "Fashion flagship event"],
    contact: "Festival Desk",
    initialPos: { x: 320, y: 650 },
    mobilePos: { x: 200, y: 520 },
    tilt: 2.2,
    cardStyle: "carnival-green"
  },
  {
    id: 6,
    title: "Khelotsav '26",
    category: "Sports Fest",
    pillar: true,
    ticketUrl: "https://makemypass.com/event/khelotsav26",
    subtitle: "Three-day sports meet",
    date: "Oct 2–4, 2026",
    venue: "College of Engineering, Trivandrum",
    prize: "Table Tennis • Badminton • Chess • 3K / 5K / 10K",
    image: "/assets/runtime/events-section/BANNER FULL.webp",
    description: "A three-day sports meet featuring racket sports, chess, and 3K, 5K, and 10K marathon events.",
    rules: ["Oct 2 published window: 06:00–14:00", "Three-day meet", "Sub-events include Table Tennis, Badminton, Chess, and Marathons"],
    contact: "Festival Desk",
    initialPos: { x: 300, y: 250 },
    mobilePos: { x: 180, y: 180 },
    tilt: -2.5,
    cardStyle: "carnival-red"
  },
  {
    id: 7,
    title: "Rangam",
    category: "Film Fest",
    pillar: true,
    subEvents: [{ name: "Short Film Competition", ticketUrl: "https://makemypass.com/event/rangam-short-film-competition" }],
    subtitle: "Short Film Competition",
    date: "Dates to be announced",
    venue: "Festival venue",
    prize: "Programme details to be announced",
    image: "/assets/runtime/events-section/banner.webp",
    description: "Rangam is Dhwani's film fest, featuring a Short Film Competition.",
    rules: ["Short Film Competition", "Dates to be announced"],
    contact: "Festival Desk",
    initialPos: { x: 1230, y: 670 },
    mobilePos: { x: 880, y: 540 },
    tilt: 1.5,
    cardStyle: "carnival-pink"
  },
  {
    id: 8,
    title: "Carpe Dictum",
    category: "Debate & Literary",
    pillar: true,
    subEvents: [
      { name: "Carpe Dictum Debate", ticketUrl: "https://makemypass.com/event/carpedictumdebate" },
      { name: "Malayalam Debate", ticketUrl: "https://makemypass.com/event/debate1" },
      { name: "Malayalam JAM", ticketUrl: "https://makemypass.com/event/maljam" },
      { name: "Malayalam Quiz", ticketUrl: "https://makemypass.com/event/malquiz" },
      { name: "Creative Writing Competition", ticketUrl: "https://makemypass.com/event/writing" },
      { name: "Script Completion Competition", ticketUrl: "https://makemypass.com/event/scriptcompletioncompetition" },
      { name: "One-Liner Writing Competition", ticketUrl: "https://makemypass.com/event/writing1" },
      { name: "Malayalam Extempore", ticketUrl: "https://makemypass.com/event/thevoiceofdhwani" }
    ],
    subtitle: "Debate and literary stream",
    date: "Dates to be announced",
    venue: "Festival venue",
    prize: "Programme details to be announced",
    image: "/assets/runtime/events-section/CARPE DICTUM GRID.webp",
    description: "Carpe Dictum is Dhwani's debate and literary stream. Seize the word.",
    rules: ["Dates to be announced", "Debate and literary stream"],
    contact: "Festival Desk",
    initialPos: { x: 640, y: 540 },
    mobilePos: { x: 440, y: 440 },
    tilt: 1.2,
    cardStyle: "carnival-gold"
  },
  {
    id: 9,
    title: "Writers' Conclave",
    category: "Details to be announced",
    ticketUrl: null,
    subEvents: [],
    subtitle: "Writers' Conclave",
    date: "Dates to be announced",
    venue: "Festival venue",
    prize: "Programme details to be announced",
    image: "/assets/runtime/events-section/writers-conclave.webp",
    description: "Writers' Conclave at Dhwani 26.",
    rules: ["Dates to be announced", "Writers' Conclave"],
    contact: "Festival Desk",
    initialPos: { x: 1560, y: 250 },
    mobilePos: { x: 1160, y: 200 },
    tilt: 1.9,
    cardStyle: "carnival-indigo",
    portrait: true
  },
  {
    id: 10,
    title: "KGT",
    category: "Details to be announced",
    ticketUrl: null,
    subEvents: [],
    subtitle: "KGT",
    date: "Dates to be announced",
    venue: "Festival venue",
    prize: "Programme details to be announced",
    image: "/assets/events-section/kgt.webp",
    description: "KGT at Dhwani 26.",
    rules: ["Dates to be announced", "KGT"],
    contact: "Festival Desk",
    initialPos: { x: 300, y: 880 },
    mobilePos: { x: 180, y: 700 },
    tilt: -2.4,
    cardStyle: "carnival-lime",
    portrait: true
  },
  {
    id: 11,
    title: "Yuva Sansad",
    category: "Details to be announced",
    ticketUrl: null,
    subEvents: [],
    subtitle: "Yuva Sansad",
    date: "Dates to be announced",
    venue: "Festival venue",
    prize: "Programme details to be announced",
    image: "/assets/runtime/events-section/yuva-sansad.webp",
    description: "Yuva Sansad at Dhwani 26.",
    rules: ["Dates to be announced", "Yuva Sansad"],
    contact: "Festival Desk",
    initialPos: { x: 760, y: 880 },
    mobilePos: { x: 540, y: 700 },
    tilt: 1.1,
    cardStyle: "carnival-magenta",
    portrait: true
  },
  {
    id: 12,
    title: "POST",
    category: "Details to be announced",
    ticketUrl: null,
    subEvents: [],
    subtitle: "POST",
    date: "Dates to be announced",
    venue: "Festival venue",
    prize: "Programme details to be announced",
    image: "/assets/runtime/events-section/post.webp",
    description: "POST at Dhwani 26.",
    rules: ["Dates to be announced", "POST"],
    contact: "Festival Desk",
    initialPos: { x: 1240, y: 880 },
    mobilePos: { x: 900, y: 700 },
    tilt: -1.6,
    cardStyle: "carnival-slate",
    portrait: true
  }
];

const PARTICLES = [...Array(8)].map((_, i) => ({
  id: i,
  left: `${10 + i * 12}%`,
  top: `${10 + (i % 3) * 25}%`,
  scale: 0.5 + Math.random() * 0.5,
  duration: 4 + i * 0.5,
  delay: i * 0.2
}));

/* One event per copy; each rail renders three copies so wrapping is seamless. */
const PILLARS = INITIAL_EVENTS.filter(event => event.pillar);
const MORE_EVENTS = INITIAL_EVENTS.filter(event => !event.pillar);

/* Pixels per second the rails drift while the section is in view. */
const MARQUEE_SPEED = 40;

function RedPushpin({ className = "" }) {
  return (
    <svg viewBox="0 0 40 50" className={`event-card__pin-svg ${className}`} aria-hidden="true">
      <path d="M 20 28 L 20 48 L 17 28 Z" fill="#b0b0b0" filter="url(#pin-shadow)" />
      <path d="M 20 28 L 20 48 L 21 28 Z" fill="#ffffff" opacity="0.6" />
      <ellipse cx="20" cy="28" rx="8" ry="3.5" fill="#a00018" />
      <path d="M 13 22 C 12 28, 28 28, 27 22 C 27 18, 23 16, 23 10 C 27 8, 25 2, 20 2 C 15 2, 13 8, 17 10 C 17 16, 13 18, 13 22 Z" fill="url(#pin-head-grad)" filter="url(#pin-shadow)" />
      <ellipse cx="17" cy="6" rx="3" ry="1.8" fill="#ffffff" opacity="0.65" transform="rotate(-20 17 6)" />
    </svg>
  );
}

function EventCard({ event, eager, stagger, onSelect }) {
  return (
    <motion.article
      className={`event-card event-card--${event.cardStyle}${event.pillar ? " event-card--pillar" : ""}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, delay: stagger * 0.07, ease: "easeOut" }}
    >
      <div className="event-card__photo-frame">
        <img src={event.image} alt={event.title} className="event-card__img" loading={eager ? "eager" : "lazy"} decoding="async" />
      </div>
      <div className="event-card__content">
        <h3 className="event-card__title">{event.title}</h3>
        {event.ticketUrl ? (
          <a className="event-card__action-btn" href={event.ticketUrl} target="_blank" rel="noreferrer" aria-label={`Get tickets for ${event.title}`}>
            Get Tickets →
          </a>
        ) : (
          <button className="event-card__action-btn" aria-label={`View details for ${event.title}`} onClick={() => onSelect(event)}>
            View Details →
          </button>
        )}
      </div>
    </motion.article>
  );
}

/* One rail per group. Each instance owns its own loop maths, because the
   repeating period differs with the group's card count and widths. */
function EventRail({ events, onSelect, marquee }) {
  const railRef = useRef(null);
  const railActive = useSceneActive(railRef);
  const loopWidthRef = useRef(0);
  const frameRef = useRef(null);
  const marqueeFrameRef = useRef(null);
  const marqueeLastRef = useRef(0);
  const marqueeCarryRef = useRef(0);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;
    const positionMiddleLoop = () => {
      if (!rail.children.length) return;
      // Exact repeating period: offset of copy-2's first card from copy-1's
      // first card. `scrollWidth / 3` counts the rail's leading/trailing
      // padding into two copies, so it drifts a few dozen px off the true
      // period and the loop visibly "jumps" on every wrap.
      const loopWidth = rail.children[events.length]?.offsetLeft - rail.children[0].offsetLeft;
      loopWidthRef.current = loopWidth > 0 ? loopWidth : rail.scrollWidth / 3;
      rail.scrollLeft = loopWidthRef.current;
    };
    const frame = requestAnimationFrame(positionMiddleLoop);
    window.addEventListener("resize", positionMiddleLoop);
    return () => {
      cancelAnimationFrame(frame);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", positionMiddleLoop);
    };
  }, [events.length]);

  /* Auto-advance nudges the native scroller, so dragging, touch panning and
     the wrap-around above all keep working. Whole-pixel steps are accumulated
     from the frame delta, and the loop is closed here rather than waiting for
     the scroll event, so the reset never shows as a stutter. */
  useEffect(() => {
    if (!marquee || held || !railActive) return undefined;
    const rail = railRef.current;
    if (!rail) return undefined;
    let cancelled = false;
    const tick = (now) => {
      if (cancelled) return;
      if (!marqueeLastRef.current) marqueeLastRef.current = now;
      // Clamp the delta so a backgrounded tab does not jump the rail.
      const elapsed = Math.min(now - marqueeLastRef.current, 64);
      marqueeLastRef.current = now;
      marqueeCarryRef.current += (MARQUEE_SPEED * elapsed) / 1000;
      const step = Math.trunc(marqueeCarryRef.current);
      const loopWidth = loopWidthRef.current;
      if (step !== 0 && loopWidth) {
        marqueeCarryRef.current -= step;
        const next = rail.scrollLeft + step;
        rail.scrollLeft = next > loopWidth * 1.5 ? next - loopWidth : next;
      }
      marqueeFrameRef.current = requestAnimationFrame(tick);
    };
    marqueeLastRef.current = 0;
    marqueeFrameRef.current = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      if (marqueeFrameRef.current) cancelAnimationFrame(marqueeFrameRef.current);
      marqueeLastRef.current = 0;
    };
  }, [marquee, held, railActive]);

  const handleScroll = useCallback(() => {
    if (frameRef.current) return;
    frameRef.current = requestAnimationFrame(() => {
      const rail = railRef.current;
      const loopWidth = loopWidthRef.current;
      if (rail && loopWidth) {
        if (rail.scrollLeft < loopWidth * 0.5) rail.scrollLeft += loopWidth;
        else if (rail.scrollLeft > loopWidth * 1.5) rail.scrollLeft -= loopWidth;
      }
      frameRef.current = null;
    });
  }, []);

  /* Hover, focus and an active drag all hold the rail still so the buttons
     and ticket links stay reachable while the marquee is running. */
  const hold = useCallback(() => setHeld(true), []);
  const release = useCallback(() => setHeld(false), []);

  return (
    <div
      className="events-card-rail"
      ref={railRef}
      onScroll={handleScroll}
      onMouseEnter={hold}
      onMouseLeave={release}
      onFocusCapture={hold}
      onBlurCapture={release}
      onPointerDown={hold}
      onPointerUp={release}
      onPointerCancel={release}
    >
      {[...events, ...events, ...events].map((event, index) => (
        <EventCard
          key={`${event.id}-${index}`}
          event={event}
          eager={railActive && index >= events.length && index < events.length * 2}
          stagger={index % events.length}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const active = useSceneActive(sectionRef);
  const reduced = useReducedMotion();
  const lenis = useLenis();

  // Freeze the page while the details sheet is open. `data-lenis-prevent` on the
  // backdrop hands wheel and touch scrolling to the sheet itself; without stopping
  // Lenis the page still scrolls behind it, which reads as the sheet not moving.
  useEffect(() => {
    if (!lenis) return;
    if (selectedEvent) lenis.stop();
    else lenis.start();
    return () => lenis.start();
  }, [selectedEvent, lenis]);

  // Mouse movement tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  // Mobile detection & layout rect caching
  useEffect(() => {
    let timeoutId;
    const updateLayout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth <= 640);
      }, 150);
    };
    
    updateLayout();
    window.addEventListener('resize', updateLayout);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateLayout);
    };
  }, []);

  // Mouse movement handler
  const handleMouseMove = useCallback((e) => {
    if (isMobile || reduced || !active) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) {
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    }
  }, [isMobile, reduced, active, mouseX, mouseY]);

  // Scroll Parallax Transforms
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const sectionParallaxY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const sectionParallaxScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.02, 1]);
  const headerParallaxY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const boardParallaxY = useTransform(smoothMouseY, [-0.5, 0.5], [-15, 15]);

  return (
    <section
      ref={sectionRef}
      id="events"
      className="events-section"
      aria-label="Festival Events"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      {/* Parallax background elements */}
      <motion.div
        className="events-parallax-bg"
        style={{
          y: reduced || isMobile ? 0 : sectionParallaxY,
          scale: reduced || isMobile ? 1 : sectionParallaxScale
        }}
        aria-hidden="true"
      />

      {/* Floating particles for ambient effect */}
      <div className="events-particles" aria-hidden="true">
        {PARTICLES.map((particle) => (
          <motion.div
            key={particle.id}
            className="particle"
            style={{
              left: particle.left,
              top: particle.top,
              scale: particle.scale
            }}
            animate={active && !reduced ? {
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1]
            } : { y: 0, opacity: 0.3, scale: 1 }}
            transition={{
              duration: particle.duration,
              repeat: active && !reduced ? Infinity : 0,
              ease: "easeInOut",
              delay: particle.delay
            }}
          />
        ))}
      </div>

      <div className="events-container">
        {/* SVG Defs for RedPushpin */}
        <svg style={{ width: 0, height: 0, position: "absolute" }} aria-hidden="true">
          <defs>
            <radialGradient id="pin-head-grad" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#ff7b7b" />
              <stop offset="40%" stopColor="#e60026" />
              <stop offset="85%" stopColor="#800010" />
              <stop offset="100%" stopColor="#400008" />
            </radialGradient>
            <filter id="pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="3" dy="6" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
            </filter>
          </defs>
        </svg>

        {/* Festival event rail header */}
        {/* <motion.header
          className="notice-board-header"
          style={{ y: headerParallaxY }}
          initial={{ opacity: 0, y: 50, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="notice-board-title">FESTIVAL EVENTS</h2>
        </motion.header> */}

        {/* Pillars of Dhwani, then everything else on the bill */}
        <motion.div
          className="events-card-rail-stack"
          style={{
            y: isMobile ? 0 : boardParallaxY
          }}
        >
          <section className="events-group events-group--pillars" aria-label="Pillars of Dhwani">
            <header className="events-group__header">
              <h2 className="events-group__title">Pillars of Dhwani</h2>
            </header>
            <EventRail events={PILLARS} onSelect={setSelectedEvent} marquee={active && !reduced} />
          </section>

          <section className="events-group events-group--more" aria-label="Other events">
            <header className="events-group__header">
              <h2 className="events-group__title">More Events</h2>
            </header>
            <EventRail events={MORE_EVENTS} onSelect={setSelectedEvent} marquee={active && !reduced} />
          </section>

          <TicketingPartner className="events-partner" />
        </motion.div>
      </div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="event-modal-backdrop"
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              className="event-modal-frame"
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="event-modal-card">
                <div className="event-modal-grid">
                <div className="event-modal-image-col">
                  <img src={selectedEvent.image} alt={selectedEvent.title} className={selectedEvent.portrait ? "event-modal-img--portrait" : ""} />
                  <div className="event-modal-badge">{selectedEvent.category}</div>
                </div>

                <div className="event-modal-info-col">
                  <h2>{selectedEvent.title}</h2>
                  <p className="event-modal-subtitle">{selectedEvent.subtitle}</p>

                  <div className="event-modal-key-stats">
                    <div><strong>Date & Time:</strong> {selectedEvent.date}</div>
                    <div><strong>Venue:</strong> {selectedEvent.venue}</div>
                    <div><strong>{selectedEvent.prizeLabel ?? "Prize Pool"}:</strong> <span className="highlight-prize">{selectedEvent.prize}</span></div>
                  </div>

                  <p className="event-modal-desc">{selectedEvent.description}</p>

                  <div className="event-modal-rules">
                    <h4>Rules & Guidelines:</h4>
                    <ul>
                      {selectedEvent.rules.map((rule, idx) => (
                        <li key={idx}>{rule}</li>
                      ))}
                    </ul>
                  </div>

                  {selectedEvent.subEvents?.length > 0 && (
                    <div className="event-modal-ticket-list">
                      <h4>Tickets</h4>
                      {selectedEvent.subEvents.map(subEvent => (
                        <a key={subEvent.name} href={subEvent.ticketUrl} target="_blank" rel="noreferrer">
                          {subEvent.name} <span>Get Tickets →</span>
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="event-modal-footer">
                    <span className="event-modal-contact">Coordinator: {selectedEvent.contact}</span>
                    {selectedEvent.ticketUrl && (
                      <a className="event-modal-reg-btn" href={selectedEvent.ticketUrl} target="_blank" rel="noreferrer">
                        Get Tickets
                      </a>
                    )}
                  </div>
                </div>
                </div>
              </div>

              {/* Outside the masked paper: the tear silhouette would otherwise
                  clip the pin and the close control. */}
              <div className="event-modal-pin">
                <RedPushpin />
              </div>

              <button
                className="event-modal-close"
                onClick={() => setSelectedEvent(null)}
                aria-label="Close modal"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
