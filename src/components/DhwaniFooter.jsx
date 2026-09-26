import React, { useRef, useCallback, useEffect } from 'react';
import { useLenis } from 'lenis/react';
import './DhwaniFooter.css';

// Embedded SVG Icons for 100% self-contained component portability
const InstagramIcon = React.memo(({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
));

const YoutubeIcon = React.memo(({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
));

const FacebookIcon = React.memo(({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
));

const LinkedInIcon = React.memo(({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M6.5 8.5H3V21h3.5V8.5ZM4.75 3A2.05 2.05 0 1 0 4.75 7.1 2.05 2.05 0 0 0 4.75 3ZM21 13.85C21 10.08 18.99 8.3 16.3 8.3c-2.17 0-3.14 1.2-3.68 2.04V8.5H9.12V21h3.5v-6.19c0-1.63.31-3.2 2.32-3.2 1.98 0 2.01 1.86 2.01 3.31V21H21v-7.15Z" />
  </svg>
));

const ArrowUpIcon = React.memo(({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 19V5"/>
    <path d="m5 12 7-7 7 7"/>
  </svg>
));

export function DhwaniFooter() {
  const footerRef = useRef(null);
  
  // Refs for elements to animate
  const glowLeftRef = useRef(null);
  const glowRightRef = useRef(null);
  const canvasRef = useRef(null);
  const mascotLeftRef = useRef(null);
  const mascotRightRef = useRef(null);
  const contentRef = useRef(null);

  const mousePosRef = useRef({ x: 0, y: 0 });
  const isHoveredRef = useRef(false);
  const rafId = useRef(null);

  const updateTransforms = useCallback(() => {
    const x = mousePosRef.current.x;
    const y = mousePosRef.current.y;
    const isHovered = isHoveredRef.current;

    const transitionStyle = isHovered ? 'none' : 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)';

    if (glowLeftRef.current) {
      glowLeftRef.current.style.transform = `translate3d(${x * 25}px, ${y * 20}px, 0)`;
    }
    if (glowRightRef.current) {
      glowRightRef.current.style.transform = `translate3d(${x * -30}px, ${y * -22}px, 0)`;
    }
    if (canvasRef.current) {
      canvasRef.current.style.transform = `scale(1.06) translate3d(${x * -20}px, ${y * -12}px, 0)`;
      canvasRef.current.style.transition = transitionStyle;
    }
    if (mascotLeftRef.current) {
      mascotLeftRef.current.style.transform = `translate3d(${x * 30}px, ${y * 18}px, 0)`;
      mascotLeftRef.current.style.transition = transitionStyle;
    }
    if (mascotRightRef.current) {
      mascotRightRef.current.style.transform = `translate3d(${x * -35}px, ${y * -20}px, 0)`;
      mascotRightRef.current.style.transition = transitionStyle;
    }
    if (contentRef.current) {
      contentRef.current.style.transform = `translate3d(${x * 10}px, ${y * 8}px, 0)`;
      contentRef.current.style.transition = transitionStyle;
    }

    rafId.current = null;
  }, []);

  const scheduleUpdate = useCallback(() => {
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(updateTransforms);
    }
  }, [updateTransforms]);

  const handleMouseMove = useCallback((e) => {
    if (!footerRef.current) return;
    const rect = footerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mousePosRef.current = { x, y };
    scheduleUpdate();
  }, [scheduleUpdate]);

  const handleTouchMove = useCallback((e) => {
    if (!footerRef.current || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = footerRef.current.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / rect.width - 0.5;
    const y = (touch.clientY - rect.top) / rect.height - 0.5;
    mousePosRef.current = { x, y };
    isHoveredRef.current = true;
    scheduleUpdate();
  }, [scheduleUpdate]);

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    mousePosRef.current = { x: 0, y: 0 };
    scheduleUpdate();
  }, [scheduleUpdate]);

  const handleTouchStart = useCallback(() => {
    isHoveredRef.current = true;
  }, []);

  const handleTouchEnd = useCallback(() => {
    isHoveredRef.current = false;
    mousePosRef.current = { x: 0, y: 0 };
    scheduleUpdate();
  }, [scheduleUpdate]);

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const lenis = useLenis();

  const scrollToTop = useCallback(() => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [lenis]);

  return (
    <footer 
      ref={footerRef}
      className="dhwani-footer-container carnival-world"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Dhwani 2026 Festival Footer"
    >
      {/* SVG Halftone Grain & Inked Noise Filter Definition */}
      <svg className="svg-noise-def" width="0" height="0">
        <filter id="dhwaniHalftoneGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="1" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.07 0" />
        </filter>
      </svg>

      {/* Layer 1: Hand-inked Halftone Grain Texture */}
      <div className="halftone-grain-overlay" aria-hidden="true" />

      {/* Layer 2: Deep Ambient Festival Lighting */}
      <div 
        ref={glowLeftRef}
        className="ambient-festival-glow glow-left"
        aria-hidden="true"
      />
      <div 
        ref={glowRightRef}
        className="ambient-festival-glow glow-right"
        aria-hidden="true"
      />
      <div 
        className="ambient-center-lantern-glow"
        aria-hidden="true"
      />

      {/* Layer 3: Handcrafted Carnival Panorama Artwork (bg.webp) */}
      <div 
        ref={canvasRef}
        className="carnival-art-canvas"
        style={{ 
          backgroundImage: "url('/assets/footer/bg.webp')"
        }}
        aria-hidden="true"
      />

      {/* Layer 4: Cinematic Vignette & Atmospheric Fog */}
      <div className="atmospheric-fog-layer" aria-hidden="true" />

      {/* Layer 6A: Dynamic Khai 2 Mascot */}
      <div 
        ref={mascotLeftRef}
        className="carnival-mascot-left-presence"
      >
        <div className="mascot-left-aura-halo" />
        <img 
          src="/assets/footer/khai2.webp" 
          alt="Khai in dynamic action pose" 
          className="mascot-khai2-img"
          loading="lazy"
        />
        <div className="mascot-left-cloud-grounding" />
      </div>

      {/* Layer 6B: Ceremonial Khai Mascot */}
      <div 
        ref={mascotRightRef}
        className="carnival-mascot-presence"
      >
        <div className="mascot-aura-halo" />
        <img 
          src="/assets/footer/KHAI.webp" 
          alt="Khai - The Dhwani Mascot" 
          className="mascot-khai-img"
          loading="lazy"
        />
        <div className="mascot-cloud-grounding" />
      </div>

      {/* Layer 7: Handcrafted Foreground Cloud Banks */}
      <div className="foreground-cloud-framing" aria-hidden="true" />

      {/* Layer 8: Editorial Content & Dhwani '26 Brand Moment */}
      <div 
        ref={contentRef}
        className="dhwani-editorial-content"
      >
        {/* Brand Core: Emblem & Festival Identity */}
        <div className="brand-editorial-header">
          <div className="dhwani-emblem-gem">
            <img 
              src="/assets/footer/icon.webp" 
              alt="Dhwani '26 Feather Emblem" 
              className="dhwani-feather-emblem"
            />
          </div>

          <div className="brand-identity-text">
            <h2 className="fest-main-title">
              <img
                src="/assets/footer/dhwani-text.webp"
                alt="Dhwani '26"
                className="dhwani-title-img"
              />
            </h2>
            {/* <p className="fest-institution-tag">
              The Annual Cultural Conclave of College of Engineering Trivandrum
            </p> */}
          </div>
        </div>

        {/* Curated Editorial Navigation */}
        <nav className="dhwani-curated-nav" aria-label="Festival Navigation">
          {[
            { label: 'EXPLORE', href: 'https://org.makemypass.com/web/dhwani-26' },
            { label: 'PRONITES', href: 'https://org.makemypass.com/web/dhwani-26' },
            { label: 'COMPETITIONS', href: 'https://org.makemypass.com/web/dhwani-26' },
            { label: 'WORKSHOPS', href: 'https://org.makemypass.com/web/dhwani-26' },
            { label: 'SCHEDULE', href: 'https://org.makemypass.com/web/dhwani-26' },
          ].map((item) => (
            <a key={item.label} href={item.href} className="curated-nav-item">
              <span className="nav-item-text">{item.label}</span>
              <span className="nav-accent-dot" />
            </a>
          ))}
        </nav>

        {/* Refined Social Connections */}
        <div className="dhwani-social-atelier">
          <div className="yellow-badge-container">
            <img 
              src="/assets/footer/yellowbadge.webp" 
              alt="Yellow Badge" 
              className="yellow-badge-img"
            />
            <div className="social-icons-inside-badge">
              <a 
                href="https://instagram.com/dhwani_cet" 
                target="_blank" 
                rel="noreferrer" 
                className="social-atelier-link social-ig" 
                aria-label="Follow Dhwani on Instagram"
              >
                <InstagramIcon size={18} />
              </a>
              <a 
                href="https://www.youtube.com/@DhwaniCET" 
                target="_blank" 
                rel="noreferrer" 
                className="social-atelier-link social-yt" 
                aria-label="Subscribe to Dhwani YouTube Channel"
              >
                <YoutubeIcon size={18} />
              </a>
              <a 
                href="https://www.facebook.com/dhwanifest" 
                target="_blank" 
                rel="noreferrer" 
                className="social-atelier-link social-fb" 
                aria-label="Follow Dhwani on Facebook"
              >
                <FacebookIcon size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/dhwani-cet/"
                target="_blank"
                rel="noreferrer"
                className="social-atelier-link social-li"
                aria-label="Follow Dhwani on LinkedIn"
              >
                <LinkedInIcon size={18} />
              </a>
            </div>
          </div>
        </div>


        {/* Closing Heritage & Credits */}
        <div className="dhwani-closing-credits">
          <p className="college-heritage-line">
            <span>COLLEGE OF ENGINEERING TRIVANDRUM</span>
            <span className="bullet-sep">•</span>
            <span>ESTD. 1939</span>
          </p>
          {/* <p className="cultural-committee-subline">
            Organized by CET Cultural Committee © 2026. All Rights Reserved.
          </p> */}
        </div>
      </div>

      {/* Architectural Scroll Anchor Button */}
      <button 
        onClick={scrollToTop}
        className="dhwani-top-anchor"
        aria-label="Scroll back to top"
        title="Scroll to top"
      >
        <ArrowUpIcon size={20} />
      </button>

    </footer>
  );
}

export default DhwaniFooter;
