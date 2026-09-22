import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion, useMotionValue, useSpring } from "motion/react";
import "./Events.css";

const INITIAL_EVENTS = [
  {
    id: 1,
    title: "Khelotsav '26",
    category: "Sports Fest",
    ticketUrl: "https://makemypass.com/event/khelotsav26",
    subEvents: ["Table Tennis", "Badminton", "Chess", "Marathon 3K", "Marathon 5K", "Marathon 10K"].map(name => ({ name, ticketUrl: "https://makemypass.com/event/khelotsav26" })),
    subtitle: "Three-day sports meet",
    date: "Oct 2–4, 2026",
    venue: "College of Engineering, Trivandrum",
    prize: "Table Tennis • Badminton • Chess • 3K / 5K / 10K",
    image: "/assets/events-section/BANNER FULL.webp",
    description: "A three-day sports meet featuring racket sports, chess, and 3K, 5K, and 10K marathon events.",
    rules: ["Oct 2 published window: 06:00–14:00", "Three-day meet", "Sub-events include Table Tennis, Badminton, Chess, and Marathons"],
    contact: "Festival Desk",
    initialPos: { x: 300, y: 250 },
    mobilePos: { x: 180, y: 180 },
    tilt: -2.5,
    cardStyle: "carnival-red"
  },
  {
    id: 2,
    title: "Antara",
    category: "Music Fest",
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
    image: "/assets/events-section/antara fulll.webp",
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
    subEvents: [
      { name: "Solo", ticketUrl: "https://makemypass.com/event/nadanta-1" },
      { name: "Workshop by Sidharth", ticketUrl: "https://makemypass.com/event/nadanta-5" },
      { name: "Duo", ticketUrl: "https://makemypass.com/event/nadanta" },
      { name: "Spot", ticketUrl: "https://makemypass.com/event/nadanta-2" },
      { name: "Battle", ticketUrl: "https://makemypass.com/event/nadanta-4" }
    ],
    subtitle: "Solo • Workshop • Duo • Spot • Battle",
    date: "Oct 2–4, 2026",
    venue: "Festival venues",
    prize: "Solo: Oct 2 • 09:00–23:30",
    image: "/assets/events-section/nadanta.webp",
    description: "A dance fest with solo, duo, spot, battle, and workshop experiences.",
    rules: ["Solo: Oct 2, 09:00–23:30", "Workshop by Sidharth", "Duo, Spot, and Battle sub-events"],
    contact: "Festival Desk",
    initialPos: { x: 1200, y: 260 },
    mobilePos: { x: 860, y: 200 },
    tilt: -1.2,
    cardStyle: "carnival-blue"
  },
  {
    id: 4,
    title: "Nazaara",
    category: "Fashion Flagship Event",
    ticketUrl: "https://makemypass.com/event/nazaara",
    subtitle: "Fashion flagship event",
    date: "Oct 3 • 14:00–23:05",
    venue: "Festival venue",
    prize: "9h 5m programme",
    image: "/assets/events-section/NAZAARA wp.webp",
    description: "Dhwani's fashion flagship event, presented across a nine-hour programme.",
    rules: ["Oct 3 programme", "14:00–23:05", "Fashion flagship event"],
    contact: "Festival Desk",
    initialPos: { x: 320, y: 650 },
    mobilePos: { x: 200, y: 520 },
    tilt: 2.2,
    cardStyle: "carnival-green"
  },
  {
    id: 5,
    title: "Dionysia",
    category: "Theatrical Fest",
    ticketUrl: null,
    subEvents: [],
    subtitle: "Theatrical fest",
    date: "Dates to be announced",
    venue: "Festival venue",
    prize: "Programme details to be announced",
    image: "/assets/events-section/dionysia.webp",
    description: "Dionysia is Dhwani's theatrical fest.",
    rules: ["Dates to be announced", "Theatrical fest"],
    contact: "Festival Desk",
    initialPos: { x: 780, y: 630 },
    mobilePos: { x: 540, y: 500 },
    tilt: -2.0,
    cardStyle: "carnival-orange"
  },
  {
    id: 6,
    title: "Rangam",
    category: "Film Fest",
    subEvents: [{ name: "Short Film Competition", ticketUrl: "https://makemypass.com/event/rangam-short-film-competition" }],
    subtitle: "Short Film Competition",
    date: "Dates to be announced",
    venue: "Festival venue",
    prize: "Programme details to be announced",
    image: "/assets/events-section/banner.webp",
    description: "Rangam is Dhwani's film fest, featuring a Short Film Competition.",
    rules: ["Short Film Competition", "Dates to be announced"],
    contact: "Festival Desk",
    initialPos: { x: 1230, y: 670 },
    mobilePos: { x: 880, y: 540 },
    tilt: 1.5,
    cardStyle: "carnival-pink"
  },
  {
    id: 7,
    title: "Carpe Dictum",
    category: "Literature Fest",
    ticketUrl: null,
    subEvents: [],
    subtitle: "Literature fest",
    date: "Dates to be announced",
    venue: "Festival venue",
    prize: "Programme details to be announced",
    image: "/assets/events-section/CARPE DICTUM GRID.webp",
    description: "Carpe Dictum is Dhwani's literature fest. Seize the word.",
    rules: ["Dates to be announced", "Literature fest"],
    contact: "Festival Desk",
    initialPos: { x: 640, y: 540 },
    mobilePos: { x: 440, y: 440 },
    tilt: 1.2,
    cardStyle: "carnival-gold"
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

/* One event per copy; the rail renders three copies so wrapping is seamless. */
const EVENT_COUNT = INITIAL_EVENTS.length;

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

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const boardRef = useRef(null);
  const railLoopWidthRef = useRef(0);
  const railFrameRef = useRef(null);

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

  useEffect(() => {
    const rail = boardRef.current;
    if (!rail) return undefined;
    const positionMiddleLoop = () => {
      if (!rail.children.length) return;
      // Exact repeating period: offset of copy-2's first card from copy-1's
      // first card. `scrollWidth / 3` counts the rail's leading/trailing
      // padding into two copies, so it drifts a few dozen px off the true
      // period and the loop visibly "jumps" on every wrap.
      const loopWidth = rail.children[EVENT_COUNT]?.offsetLeft - rail.children[0].offsetLeft;
      railLoopWidthRef.current = loopWidth > 0 ? loopWidth : rail.scrollWidth / 3;
      rail.scrollLeft = railLoopWidthRef.current;
    };
    const frame = requestAnimationFrame(positionMiddleLoop);
    window.addEventListener("resize", positionMiddleLoop);
    return () => {
      cancelAnimationFrame(frame);
      if (railFrameRef.current) cancelAnimationFrame(railFrameRef.current);
      window.removeEventListener("resize", positionMiddleLoop);
    };
  }, []);

  const handleRailScroll = useCallback(() => {
    if (railFrameRef.current) return;
    railFrameRef.current = requestAnimationFrame(() => {
      const rail = boardRef.current;
      const loopWidth = railLoopWidthRef.current;
      if (rail && loopWidth) {
        if (rail.scrollLeft < loopWidth * 0.5) rail.scrollLeft += loopWidth;
        else if (rail.scrollLeft > loopWidth * 1.5) rail.scrollLeft -= loopWidth;
      }
      railFrameRef.current = null;
    });
  }, []);

  // Mouse movement handler
  const handleMouseMove = useCallback((e) => {
    if (isMobile) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) {
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    }
  }, [isMobile, mouseX, mouseY]);

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
          y: sectionParallaxY,
          scale: sectionParallaxScale
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
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
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
        <motion.header
          className="notice-board-header"
          style={{ y: headerParallaxY }}
          initial={{ opacity: 0, y: 50, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="notice-board-title">FESTIVAL EVENTS</h2>
        </motion.header>

        {/* Horizontal event cards */}
        <motion.div
          className="events-card-rail-wrap"
          style={{
            y: isMobile ? 0 : boardParallaxY
          }}
        >
          <div className="events-card-rail" ref={boardRef} onScroll={handleRailScroll}>
            {[...INITIAL_EVENTS, ...INITIAL_EVENTS, ...INITIAL_EVENTS].map((event, index) => (
                  <motion.article
                    key={`${event.id}-${index}`}
                    className={`event-card event-card--${event.cardStyle}`}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.55, delay: index * 0.07, ease: "easeOut" }}
                  >
                    <div className="event-card__photo-frame">
                      <img src={event.image} alt={event.title} className="event-card__img" loading={index >= 6 && index < 12 ? "eager" : "lazy"} decoding="async" />
                    </div>
                    <div className="event-card__content">
                      <h3 className="event-card__title">{event.title}</h3>
                      {event.ticketUrl ? (
                        <a className="event-card__action-btn" href={event.ticketUrl} target="_blank" rel="noreferrer" aria-label={`Get tickets for ${event.title}`}>
                          Get Tickets →
                        </a>
                      ) : (
                        <button className="event-card__action-btn" aria-label={`View details for ${event.title}`} onClick={() => setSelectedEvent(event)}>
                          View Details →
                        </button>
                      )}
                    </div>
                  </motion.article>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="event-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              className="event-modal-card"
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="event-modal-close"
                onClick={() => setSelectedEvent(null)}
                aria-label="Close modal"
              >
                ×
              </button>

              <div className="event-modal-pin">
                <RedPushpin />
              </div>

              <div className="event-modal-grid">
                <div className="event-modal-image-col">
                  <img src={selectedEvent.image} alt={selectedEvent.title} />
                  <div className="event-modal-badge">{selectedEvent.category}</div>
                </div>

                <div className="event-modal-info-col">
                  <h2>{selectedEvent.title}</h2>
                  <p className="event-modal-subtitle">{selectedEvent.subtitle}</p>

                  <div className="event-modal-key-stats">
                    <div><strong>Date & Time:</strong> {selectedEvent.date}</div>
                    <div><strong>Venue:</strong> {selectedEvent.venue}</div>
                    <div><strong>Prize Pool:</strong> <span className="highlight-prize">{selectedEvent.prize}</span></div>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
