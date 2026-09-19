import React, { useState, useRef } from 'react';

// Embedded SVG Icons for 100% self-contained component portability
const InstagramIcon = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const YoutubeIcon = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor"/>
  </svg>
);

const DiscordIcon = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6h0a14.5 14.5 0 0 0-3.26-1.01.1.1 0 0 0-.1.05c-.14.25-.3.58-.41.83a13.38 13.38 0 0 0-4.46 0 9.7 9.7 0 0 0-.42-.83.1.1 0 0 0-.1-.05A14.4 14.4 0 0 0 6 6a.1.1 0 0 0-.05.04C3.89 9.3 3.3 12.52 3.6 15.7a.1.1 0 0 0 .04.07 14.6 14.6 0 0 0 4.4 2.22.1.1 0 0 0 .11-.04c.34-.46.64-.95.9-1.47a.1.1 0 0 0-.05-.14 9.6 9.6 0 0 1-1.37-.65.1.1 0 0 1 0-.16c.09-.07.19-.14.28-.21a.1.1 0 0 1 .1 0c2.88 1.32 6 1.32 8.86 0a.1.1 0 0 1 .1 0c.09.07.18.14.28.21a.1.1 0 0 1 0 .16c-.44.25-.9.47-1.37.65a.1.1 0 0 0-.05.14c.27.52.57 1.01.9 1.47a.1.1 0 0 0 .1.04 14.56 14.56 0 0 0 4.42-2.22.1.1 0 0 0 .04-.07c.36-3.64-.6-6.84-2.54-9.66a.1.1 0 0 0-.05-.04ZM9.67 14.15c-.83 0-1.51-.76-1.51-1.7 0-.93.66-1.7 1.51-1.7.86 0 1.53.77 1.51 1.7 0 .94-.66 1.7-1.51 1.7Zm4.66 0c-.83 0-1.51-.76-1.51-1.7 0-.93.66-1.7 1.51-1.7.86 0 1.53.77 1.51 1.7 0 .94-.66 1.7-1.51 1.7Z"/>
  </svg>
);

const ArrowUpIcon = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 19V5"/>
    <path d="m5 12 7-7 7 7"/>
  </svg>
);

export function DhwaniFooter() {
  const footerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!footerRef.current) return;
    const rect = footerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleTouchMove = (e) => {
    if (!footerRef.current || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = footerRef.current.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / rect.width - 0.5;
    const y = (touch.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
    setIsHovered(true);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  // Parallax offsets for multi-plane depth
  const bgOffsetX = mousePos.x * -20;
  const bgOffsetY = mousePos.y * -12;
  const mascotOffsetX = mousePos.x * -35;
  const mascotOffsetY = mousePos.y * -20;
  const mascotLeftOffsetX = mousePos.x * 30;
  const mascotLeftOffsetY = mousePos.y * 18;
  const contentOffsetX = mousePos.x * 10;
  const contentOffsetY = mousePos.y * 8;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      ref={footerRef}
      className="dhwani-footer-container carnival-world"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={handleTouchEnd}
      aria-label="Dhwani 2026 Festival Footer"
    >
      {/* 100% Self-Contained Stylesheet for Copy-Pasting */}
      <style>{`
        .dhwani-footer-container.carnival-world {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          background-color: #06020f;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 0;
          perspective: 1200px;
          border: none;
          outline: none;
          box-sizing: border-box;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .dhwani-footer-container * {
          box-sizing: border-box;
        }

        .svg-noise-def {
          position: absolute;
          width: 0;
          height: 0;
          pointer-events: none;
        }

        .halftone-grain-overlay {
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
          filter: url(#dhwaniHalftoneGrain);
          opacity: 0.85;
          mix-blend-mode: overlay;
        }

        .ambient-festival-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 2;
          filter: blur(95px);
          will-change: transform;
        }

        .ambient-festival-glow.glow-left {
          top: 10%;
          left: -5%;
          width: 650px;
          height: 650px;
          background: radial-gradient(circle, rgba(225, 29, 72, 0.35) 0%, rgba(139, 92, 246, 0.2) 45%, transparent 75%);
        }

        .ambient-festival-glow.glow-right {
          bottom: 0%;
          right: -5%;
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, rgba(245, 158, 11, 0.2) 50%, transparent 75%);
        }

        .ambient-center-lantern-glow {
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 750px;
          height: 450px;
          background: radial-gradient(ellipse, rgba(251, 191, 36, 0.14) 0%, rgba(244, 63, 94, 0.08) 50%, transparent 80%);
          filter: blur(80px);
          pointer-events: none;
          z-index: 2;
        }

        .carnival-art-canvas {
          position: absolute;
          inset: -30px;
          background-size: cover;
          background-position: center bottom;
          background-repeat: no-repeat;
          z-index: 1;
          filter: contrast(1.05) saturate(1.1) brightness(1.05);
          will-change: transform;
        }

        .atmospheric-fog-layer {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at 50% 50%, rgba(6, 2, 15, 0.15) 0%, rgba(6, 2, 15, 0.6) 85%, #06020f 100%),
            linear-gradient(180deg, rgba(6, 2, 15, 0.85) 0%, rgba(6, 2, 15, 0.1) 25%, rgba(6, 2, 15, 0.1) 75%, rgba(6, 2, 15, 0.85) 100%);
          z-index: 2;
          pointer-events: none;
        }

        /* Khai 2 Mascot (Left) */
        .carnival-mascot-left-presence {
          position: absolute;
          left: 2%;
          bottom: 0;
          width: 410px;
          max-width: 29vw;
          z-index: 4;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          will-change: transform;
        }

        .mascot-left-aura-halo {
          position: absolute;
          bottom: 25%;
          width: 320px;
          height: 360px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, rgba(244, 63, 94, 0.2) 45%, transparent 75%);
          filter: blur(55px);
          z-index: -1;
          animation: mascotLeftHaloPulse 5.5s ease-in-out infinite alternate;
        }

        @keyframes mascotLeftHaloPulse {
          0% { transform: scale(0.9); opacity: 0.7; }
          100% { transform: scale(1.18); opacity: 1; }
        }

        .mascot-khai2-img {
          width: 100%;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 0 25px rgba(6, 182, 212, 0.45)) drop-shadow(0 15px 35px rgba(0, 0, 0, 0.8));
          transform-origin: bottom center;
          animation: mascotLeftGentleHover 6.5s ease-in-out infinite alternate;
        }

        @keyframes mascotLeftGentleHover {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(-1deg); }
          100% { transform: translateY(-4px) rotate(0.8deg); }
        }

        .mascot-left-cloud-grounding {
          position: absolute;
          bottom: -20px;
          width: 120%;
          height: 90px;
          background: radial-gradient(ellipse at center, rgba(6, 2, 15, 0.95) 0%, rgba(6, 2, 15, 0.6) 60%, transparent 80%);
          filter: blur(20px);
        }

        /* Khai Mascot (Right) */
        .carnival-mascot-presence {
          position: absolute;
          right: 0;
          bottom: 270px;
          width: 375px;
          max-width: 26vw;
          z-index: 4;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          will-change: transform;
        }

        .mascot-aura-halo {
          position: absolute;
          bottom: 25%;
          width: 300px;
          height: 330px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(244, 63, 94, 0.3) 0%, rgba(251, 191, 36, 0.25) 45%, transparent 75%);
          filter: blur(55px);
          z-index: -1;
          animation: mascotHaloPulse 5s ease-in-out infinite alternate;
        }

        @keyframes mascotHaloPulse {
          0% { transform: scale(0.92); opacity: 0.7; }
          100% { transform: scale(1.15); opacity: 1; }
        }

        .mascot-khai-img {
          width: 100%;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 0 25px rgba(244, 63, 94, 0.45)) drop-shadow(0 15px 35px rgba(0, 0, 0, 0.8));
          transform-origin: bottom center;
          animation: mascotGentleHover 7s ease-in-out infinite alternate;
        }

        @keyframes mascotGentleHover {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(0.8deg); }
          100% { transform: translateY(-4px) rotate(-0.5deg); }
        }

        .mascot-cloud-grounding {
          position: absolute;
          bottom: -20px;
          width: 120%;
          height: 90px;
          background: radial-gradient(ellipse at center, rgba(6, 2, 15, 0.95) 0%, rgba(6, 2, 15, 0.6) 60%, transparent 80%);
          filter: blur(20px);
        }

        .foreground-cloud-framing {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 120px;
          background: linear-gradient(0deg, #06020f 20%, rgba(6, 2, 15, 0.8) 55%, transparent 100%);
          z-index: 4;
          pointer-events: none;
        }

        .dhwani-editorial-content {
          position: relative;
          z-index: 5;
          width: 100%;
          max-width: 920px;
          margin: 0 auto;
          padding: 60px 24px 50px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          will-change: transform;
        }

        .brand-editorial-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 34px;
        }

        .dhwani-emblem-gem {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 22px;
          transition: transform 0.3s ease;
        }

        .dhwani-emblem-gem:hover {
          transform: translateY(-2px) scale(1.04);
        }

        .dhwani-feather-emblem {
          width: 78px;
          height: 78px;
          object-fit: contain;
          border-radius: 50%;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6));
        }

        .brand-identity-text {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .fest-main-title {
          margin: 0 0 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dhwani-title-img {
          width: min(360px, 85vw);
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 4px 18px rgba(244, 63, 94, 0.5));
        }

        .fest-institution-tag {
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.38em;
          color: #cbd5e1;
          margin: 0;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
        }

        .dhwani-curated-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
          margin-bottom: 36px;
        }

        .curated-nav-item {
          position: relative;
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: #e2e8f0;
          padding: 6px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.25s ease;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
        }

        .nav-accent-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #f43f5e;
          margin-top: 6px;
          opacity: 0;
          transform: scale(0);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 0 8px #f43f5e;
        }

        .curated-nav-item:hover {
          color: #ffffff;
          text-shadow: 0 0 16px rgba(56, 189, 248, 0.95), 0 0 30px rgba(244, 63, 94, 0.6);
          transform: translateY(-2px);
        }

        .curated-nav-item:hover .nav-accent-dot {
          opacity: 1;
          transform: scale(1);
          background: #06b6d4;
          box-shadow: 0 0 10px #06b6d4;
        }

        .dhwani-social-atelier {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-bottom: 34px;
        }

        .social-atelier-link {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #f1f5f9;
          text-decoration: none;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        .social-ig:hover {
          background: linear-gradient(135deg, #e1306c, #fd1d1d);
          border-color: #fd1d1d;
          box-shadow: 0 0 25px rgba(225, 48, 108, 0.85);
          transform: translateY(-4px) scale(1.12);
          color: #ffffff;
        }

        .social-yt:hover {
          background: #ff0000;
          border-color: #ff0000;
          box-shadow: 0 0 25px rgba(255, 0, 0, 0.85);
          transform: translateY(-4px) scale(1.12);
          color: #ffffff;
        }

        .social-sp:hover {
          background: #1db954;
          border-color: #1db954;
          box-shadow: 0 0 25px rgba(29, 185, 84, 0.85);
          transform: translateY(-4px) scale(1.12);
          color: #ffffff;
        }

        .social-dc:hover {
          background: #5865f2;
          border-color: #5865f2;
          box-shadow: 0 0 25px rgba(88, 101, 242, 0.85);
          transform: translateY(-4px) scale(1.12);
          color: #ffffff;
        }

        .dhwani-closing-credits {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          max-width: 680px;
        }

        .college-heritage-line {
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.32em;
          color: #e2e8f0;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);
        }

        .bullet-sep {
          color: #f43f5e;
          font-size: 0.7rem;
          text-shadow: 0 0 6px #f43f5e;
        }

        .cultural-committee-subline {
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          color: #94a3b8;
          margin: 0;
          line-height: 1.6;
        }

        .dhwani-top-anchor {
          position: absolute;
          right: 32px;
          bottom: 32px;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(251, 191, 36, 0.3);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
        }

        .dhwani-top-anchor:hover {
          background: linear-gradient(135deg, #f43f5e 0%, #06b6d4 100%);
          border-color: #ffffff;
          transform: translateY(-5px) scale(1.12);
          box-shadow: 0 0 30px rgba(244, 63, 94, 0.8), 0 0 50px rgba(6, 182, 212, 0.5);
        }

        @media (max-width: 1280px) {
          .carnival-mascot-left-presence {
            width: 330px;
            left: 0.5%;
            opacity: 0.9;
          }
          .carnival-mascot-presence {
            width: 360px;
            right: 1%;
            opacity: 0.9;
          }
        }

        @media (max-width: 1024px) {
          .dhwani-footer-container.carnival-world {
            min-height: 90vh;
          }
          .dhwani-title-img {
            width: min(300px, 80vw);
          }
          .carnival-mascot-left-presence {
            width: 260px;
            left: 0;
            opacity: 0.75;
          }
          .carnival-mascot-presence {
            width: 290px;
            right: 0;
            opacity: 0.75;
          }
          .dhwani-curated-nav {
            gap: 22px;
          }
        }

        @media (max-width: 768px) {
          .dhwani-footer-container.carnival-world {
            min-height: auto;
            padding: 70px 16px 50px;
            flex-direction: column;
            justify-content: flex-end;
          }

          .dhwani-editorial-content {
            padding: 30px 12px 40px;
            width: 100%;
            max-width: 100%;
          }

          .dhwani-feather-emblem {
            width: 64px;
            height: 64px;
          }

          .dhwani-title-img {
            width: min(280px, 78vw);
          }

          .fest-institution-tag {
            font-size: clamp(0.68rem, 2.8vw, 0.78rem);
            letter-spacing: clamp(0.14em, 2vw, 0.28em);
            padding: 0 10px;
            line-height: 1.5;
          }

          .carnival-mascot-left-presence {
            display: flex;
            position: absolute;
            left: 10px;
            top: 20px;
            right: auto;
            bottom: auto;
            width: min(140px, 32vw);
            max-width: 140px;
            opacity: 0.88;
            z-index: 3;
            pointer-events: none;
          }

          .carnival-mascot-left-presence .mascot-left-cloud-grounding {
            display: none;
          }

          .carnival-mascot-presence {
            display: flex;
            position: absolute;
            right: -20px;
            bottom: -10px;
            left: auto;
            top: auto;
            width: min(160px, 38vw);
            max-width: 160px;
            opacity: 0.8;
            z-index: 3;
            pointer-events: none;
          }

          .mascot-khai2-img, .mascot-khai-img {
            filter: drop-shadow(0 0 15px rgba(244, 63, 94, 0.4)) drop-shadow(0 8px 20px rgba(0, 0, 0, 0.8));
          }

          .dhwani-curated-nav {
            gap: 12px 18px;
            margin-bottom: 28px;
          }

          .curated-nav-item {
            font-size: 0.78rem;
            letter-spacing: 0.16em;
            padding: 8px 6px;
          }

          .dhwani-social-atelier {
            gap: 16px;
            margin-bottom: 28px;
          }

          .social-atelier-link {
            width: 44px;
            height: 44px;
          }

          .college-heritage-line {
            font-size: clamp(0.65rem, 2.2vw, 0.74rem);
            letter-spacing: clamp(0.12em, 2vw, 0.22em);
            flex-wrap: wrap;
            justify-content: center;
            text-align: center;
            gap: 6px 8px;
            padding: 0 10px;
          }

          .cultural-committee-subline {
            font-size: clamp(0.64rem, 2vw, 0.7rem);
            letter-spacing: 0.12em;
            text-align: center;
            line-height: 1.5;
            padding: 0 12px;
          }

          .dhwani-top-anchor {
            right: 16px;
            bottom: 16px;
            width: 42px;
            height: 42px;
          }
        }

        @media (max-width: 480px) {
          .dhwani-footer-container.carnival-world {
            padding: 50px 12px 40px;
          }

          .dhwani-title-img {
            width: min(240px, 82vw);
          }

          .carnival-mascot-left-presence {
            width: min(110px, 28vw);
            left: 5px;
            top: 12px;
            right: auto;
            bottom: auto;
            opacity: 0.82;
          }

          .carnival-mascot-presence {
            width: min(128px, 32vw);
            right: -15px;
            bottom: -5px;
            left: auto;
            top: auto;
            opacity: 0.65;
          }

          .dhwani-curated-nav {
            gap: 10px 14px;
          }

          .curated-nav-item {
            font-size: 0.72rem;
            letter-spacing: 0.12em;
            padding: 6px 4px;
          }

          .social-atelier-link {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>

      {/* SVG Halftone Grain & Inked Noise Filter Definition */}
      <svg className="svg-noise-def" width="0" height="0">
        <filter id="dhwaniHalftoneGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.07 0" />
        </filter>
      </svg>

      {/* Layer 1: Hand-inked Halftone Grain Texture */}
      <div className="halftone-grain-overlay" aria-hidden="true" />

      {/* Layer 2: Deep Ambient Festival Lighting */}
      <div 
        className="ambient-festival-glow glow-left"
        style={{ transform: `translate3d(${mousePos.x * 25}px, ${mousePos.y * 20}px, 0)` }}
        aria-hidden="true"
      />
      <div 
        className="ambient-festival-glow glow-right"
        style={{ transform: `translate3d(${mousePos.x * -30}px, ${mousePos.y * -22}px, 0)` }}
        aria-hidden="true"
      />
      <div 
        className="ambient-center-lantern-glow"
        aria-hidden="true"
      />

      {/* Layer 3: Handcrafted Carnival Panorama Artwork (bg.png) */}
      <div 
        className="carnival-art-canvas"
        style={{ 
          backgroundImage: "url('/assets/footer/bg.png')",
          transform: `scale(1.06) translate3d(${bgOffsetX}px, ${bgOffsetY}px, 0)`,
          transition: isHovered ? 'transform 0.12s ease-out' : 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        aria-hidden="true"
      />

      {/* Layer 4: Cinematic Vignette & Atmospheric Fog */}
      <div className="atmospheric-fog-layer" aria-hidden="true" />

      {/* Layer 6A: Dynamic Khai 2 Mascot */}
      <div 
        className="carnival-mascot-left-presence"
        style={{
          transform: `translate3d(${mascotLeftOffsetX}px, ${mascotLeftOffsetY}px, 0)`,
          transition: isHovered ? 'transform 0.15s ease-out' : 'transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className="mascot-left-aura-halo" />
        <img 
          src="/assets/footer/khai2.png" 
          alt="Khai in dynamic action pose" 
          className="mascot-khai2-img"
          loading="lazy"
        />
        <div className="mascot-left-cloud-grounding" />
      </div>

      {/* Layer 6B: Ceremonial Khai Mascot */}
      <div 
        className="carnival-mascot-presence"
        style={{
          transform: `translate3d(${mascotOffsetX}px, ${mascotOffsetY}px, 0)`,
          transition: isHovered ? 'transform 0.15s ease-out' : 'transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className="mascot-aura-halo" />
        <img 
          src="/assets/footer/KHAI.png" 
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
        className="dhwani-editorial-content"
        style={{
          transform: `translate3d(${contentOffsetX}px, ${contentOffsetY}px, 0)`,
          transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Brand Core: Emblem & Festival Identity */}
        <div className="brand-editorial-header">
          <div className="dhwani-emblem-gem">
            <img 
              src="/assets/footer/icon.png" 
              alt="Dhwani '26 Feather Emblem" 
              className="dhwani-feather-emblem"
            />
          </div>

          <div className="brand-identity-text">
            <h2 className="fest-main-title">
              <img
                src="/assets/footer/dhwani-text.png"
                alt="Dhwani '26"
                className="dhwani-title-img"
              />
            </h2>
            <p className="fest-institution-tag">
              The Annual Cultural Conclave of College of Engineering Trivandrum
            </p>
          </div>
        </div>

        {/* Curated Editorial Navigation */}
        <nav className="dhwani-curated-nav" aria-label="Festival Navigation">
          {[
            { label: 'EXPLORE', href: '#hero' },
            { label: 'PRONITES', href: '#pronites' },
            { label: 'COMPETITIONS', href: '#competitions' },
            { label: 'WORKSHOPS', href: '#workshops' },
            { label: 'SCHEDULE', href: '#schedule' },
          ].map((item) => (
            <a key={item.label} href={item.href} className="curated-nav-item">
              <span className="nav-item-text">{item.label}</span>
              <span className="nav-accent-dot" />
            </a>
          ))}
        </nav>

        {/* Refined Social Connections */}
        <div className="dhwani-social-atelier">
          <a 
            href="https://instagram.com/dhwanicet" 
            target="_blank" 
            rel="noreferrer" 
            className="social-atelier-link social-ig" 
            aria-label="Follow Dhwani on Instagram"
          >
            <InstagramIcon size={19} />
          </a>
          <a 
            href="https://youtube.com/dhwanicet" 
            target="_blank" 
            rel="noreferrer" 
            className="social-atelier-link social-yt" 
            aria-label="Subscribe to Dhwani YouTube Channel"
          >
            <YoutubeIcon size={19} />
          </a>
          <a 
            href="https://spotify.com" 
            target="_blank" 
            rel="noreferrer" 
            className="social-atelier-link social-sp" 
            aria-label="Listen to Dhwani Official Festival Playlist"
          >
            <DiscordIcon size={19} />
          </a>
        </div>

        {/* Closing Heritage & Credits */}
        <div className="dhwani-closing-credits">
          <p className="college-heritage-line">
            <span>COLLEGE OF ENGINEERING TRIVANDRUM</span>
            <span className="bullet-sep">•</span>
            <span>ESTD. 1939</span>
          </p>
          <p className="cultural-committee-subline">
            Organized by CET Cultural Committee © 2026. All Rights Reserved.
          </p>
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
