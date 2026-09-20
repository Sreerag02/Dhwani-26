import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import "./Events.css";

const EVENT_CATEGORIES = ["All", "Dance", "Music", "Proshow", "Cultural", "Dramatics"];

const PLACEHOLDER_EVENTS = [
  {
    id: 1,
    title: "Choreo Night",
    category: "Dance",
    subtitle: "Western Group Dance Championship",
    date: "Oct 2 • 6:30 PM",
    venue: "Main Stage",
    prize: "₹75,000",
    image: "/assets/elements/stalls.png",
    description: "Feel the floor vibrate as the premier dance crews from across the nation battle it out with high-octane choreography, synchronization, and electrifying stage presence.",
    rules: ["Team size: 8-24 members", "Time limit: 8-12 minutes", "Props permitted with prior approval"],
    contact: "Ananya - 9876543210"
  },
  {
    id: 2,
    title: "Rhapsody: Battle of Bands",
    category: "Music",
    subtitle: "Rock & Fusion Live Showdown",
    date: "Oct 3 • 5:00 PM",
    venue: "Open Air Theatre",
    prize: "₹50,000",
    image: "/assets/mascot/sign-right.png",
    description: "Distorted guitars, roaring drums, and soul-stirring vocals. Witness the fiercest musical showdown where raw talent meets festival energy.",
    rules: ["Team size: 3-8 members", "Time limit: 20 minutes (setup included)", "Original compositions bonus points"],
    contact: "Rahul - 9876543211"
  },
  {
    id: 3,
    title: "Carnival Proshow Night",
    category: "Proshow",
    subtitle: "Star Concert Live Performance",
    date: "Oct 4 • 7:00 PM",
    venue: "Main Arena",
    prize: "Entry Pass Required",
    image: "/assets/footer/khai2.png",
    description: "The crown jewel of Dhwani '26! An unforgettable night featuring top headline artists, luminous lights, laser shows, and non-stop music.",
    rules: ["ID card required at entrance", "Gates open at 5:30 PM", "No re-entry permitted"],
    contact: "Festival Desk - 9876543212"
  },
  {
    id: 4,
    title: "Nukkad Natak",
    category: "Dramatics",
    subtitle: "Street Play Competition",
    date: "Oct 2 • 2:00 PM",
    venue: "Central Courtyard",
    prize: "₹30,000",
    image: "/assets/mascot/sign-left.png",
    description: "Powerful voices, beat of the dholak, and compelling storytelling addressing social themes under the open sky.",
    rules: ["Team size: 10-20 members", "Time limit: 15 minutes", "Microphones not allowed"],
    contact: "Siddharth - 9876543213"
  },
  {
    id: 5,
    title: "Voice of Dhwani",
    category: "Music",
    subtitle: "Solo Singing Extravaganza",
    date: "Oct 3 • 11:00 AM",
    venue: "Auditorium",
    prize: "₹25,000",
    image: "/assets/mascot/khai.png",
    description: "Showcase your vocal prowess across classical, semi-classical, and light music categories in front of eminent judges.",
    rules: ["Solo performance", "Time limit: 5 minutes", "One backing track allowed"],
    contact: "Meera - 9876543214"
  },
  {
    id: 6,
    title: "Cosplay Carnival",
    category: "Cultural",
    subtitle: "Anime & Pop-Culture Masquerade",
    date: "Oct 4 • 3:30 PM",
    venue: "Festival Plaza",
    prize: "₹35,000",
    image: "/assets/khai/outfits.png",
    description: "Step into the shoes of your favorite fantasy, anime, or pop-culture character. Runway walk, skit presentation, and costume design awards.",
    rules: ["Individual or Duo entry", "Prop safety check required", "2-minute stage walk/act"],
    contact: "Vikram - 9876543215"
  }
];

function RedPushpin({ className = "" }) {
  return (
    <svg viewBox="0 0 40 50" className={`event-card__pin-svg ${className}`} aria-hidden="true">
      <defs>
        <radialGradient id="pin-head-grad" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ff7b7b" />
          <stop offset="40%" stopColor="#e60026" />
          <stop offset="85%" stopColor="#800010" />
          <stop offset="100%" stopColor="#400008" />
        </radialGradient>
        <filter id="pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="3" dy="6" stdDeviation="3" floodColor="#000" floodOpacity="0.45" />
        </filter>
      </defs>
      {/* Pin Needle */}
      <path d="M 20 28 L 20 48 L 17 28 Z" fill="#b0b0b0" filter="url(#pin-shadow)" />
      <path d="M 20 28 L 20 48 L 21 28 Z" fill="#ffffff" opacity="0.6" />
      {/* Base ring */}
      <ellipse cx="20" cy="28" rx="8" ry="3.5" fill="#a00018" />
      {/* Body bulb */}
      <path d="M 13 22 C 12 28, 28 28, 27 22 C 27 18, 23 16, 23 10 C 27 8, 25 2, 20 2 C 15 2, 13 8, 17 10 C 17 16, 13 18, 13 22 Z" fill="url(#pin-head-grad)" filter="url(#pin-shadow)" />
      {/* Highlight glow */}
      <ellipse cx="17" cy="6" rx="3" ry="1.8" fill="#ffffff" opacity="0.65" transform="rotate(-20 17 6)" />
    </svg>
  );
}

export default function Events() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredEvents = activeCategory === "All"
    ? PLACEHOLDER_EVENTS
    : PLACEHOLDER_EVENTS.filter(e => e.category === activeCategory);

  return (
    <section id="events" className="events-section" aria-label="Events Notice Board">
      {/* Top transition drape for smooth scrolling from Khai section */}
      <div className="events-transition-top" />

      <div className="events-container">
        {/* Notice Board Header */}
        <header className="notice-board-header">
          <div className="notice-board-banner">
            <span className="notice-board-badge">DHWANI '26</span>
            <h2 className="notice-board-title">FESTIVAL NOTICE BOARD</h2>
            <p className="notice-board-subtitle">Pin your spot at the biggest events of the year!</p>
          </div>

          {/* Category Filter Tabs */}
          <nav className="events-filter-tabs" aria-label="Event category filter">
            {EVENT_CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`events-tab-btn ${activeCategory === cat ? "is-active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </nav>
        </header>

        {/* Notice Board Area */}
        <div className="notice-board-frame">
          <div className="notice-board-cork">
            <div className="events-grid">
              {filteredEvents.map((event, index) => {
                // Slight random rotation for pin note feel (-2.5deg to 2.5deg)
                const rotations = [-2, 1.5, -1, 2, -1.8, 1.2];
                const tiltAngle = rotations[index % rotations.length];

                return (
                  <motion.article
                    key={event.id}
                    className="event-card"
                    style={{ "--card-tilt": `${tiltAngle}deg` }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    whileHover={{ scale: 1.03, rotate: 0, zIndex: 10 }}
                    onClick={() => setSelectedEvent(event)}
                  >
                    {/* Pushpin on top */}
                    <div className="event-card__pin-wrapper">
                      <RedPushpin />
                    </div>

                    {/* Paper tape element */}
                    <div className="event-card__tape" />

                    {/* Photo Container */}
                    <div className="event-card__photo-frame">
                      <img src={event.image} alt={event.title} className="event-card__img" loading="lazy" />
                      <span className="event-card__badge">{event.category}</span>
                    </div>

                    {/* Content */}
                    <div className="event-card__content">
                      <div className="event-card__meta">
                        <span className="event-card__date">{event.date}</span>
                        <span className="event-card__venue">{event.venue}</span>
                      </div>
                      <h3 className="event-card__title">{event.title}</h3>
                      <p className="event-card__subtitle">{event.subtitle}</p>
                      
                      <div className="event-card__footer">
                        <span className="event-card__prize">Prize: <strong>{event.prize}</strong></span>
                        <button className="event-card__action-btn" aria-label={`View details for ${event.title}`}>
                          Details →
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
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

                  <div className="event-modal-footer">
                    <span className="event-modal-contact">Coordinator: {selectedEvent.contact}</span>
                    <button
                      className="event-modal-reg-btn"
                      onClick={() => alert(`Registration for ${selectedEvent.title} will open soon!`)}
                    >
                      Register Now
                    </button>
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
