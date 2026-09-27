import { useCallback, useEffect, useRef, useState } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { useAnimationFrame } from "motion/react";
import "lenis/dist/lenis.css";
import SideNavbar from "./components/SideNavbar";
import CampusAmbassador from "./components/CampusAmbassador";
import CampusAmbassadorBand from "./sections/CampusAmbassador";
import ScrollExperience from "./sections/ScrollExperience";
import Events from "./sections/Events";
import DhwaniFooter from "./components/DhwaniFooter";
import { isCampusAmbassadorPage } from "./lib/routes";
import useMediaQuery from "./hooks/useMediaQuery";

function LenisFramerSync() {
  const lenis = useLenis();
  useAnimationFrame((time) => {
    lenis?.raf(time);
  });
  return null;
}

export default function App() {
  const nextPage = useRef(null);
  // Compact screens toggle the header through the journey: up for the artist
  // chapter, away for merch, back for events. Desktop and tablet keep the header
  // out of the journey entirely and only show it once merch is behind you, which
  // the events boundary already covers. Breakpoint matches the one the nav and
  // the events pin already switch at.
  const compact = useMediaQuery("(max-width: 700px)");
  // The header is driven by scroll position, not latched on first sight, so
  // scrolling back up re-hides it. `isIntersecting` alone is enough because it
  // reports the sections current state in both directions.
  const [pastJourney, setPastJourney] = useState(false);
  const [journeyNav, setJourneyNav] = useState(false);
  useEffect(() => {
    const el = nextPage.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPastJourney(entry.isIntersecting),
      { threshold: 0, rootMargin: '0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onJourneyNav = useCallback(next => setJourneyNav(prev => (prev === next ? prev : next)), []);
  const headerVisible = isCampusAmbassadorPage || pastJourney || (compact && journeyNav);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }} autoRaf={false}>
      <LenisFramerSync />
      {isCampusAmbassadorPage ? (
        <>
          <div className="global-navigation" data-nav="shown"><SideNavbar /></div>
          <main className="dhwani-site">
            <CampusAmbassador />
            <DhwaniFooter />
          </main>
        </>
      ) : (
        <>
          <div className="global-navigation" data-nav={headerVisible ? "shown" : "hidden"}>
            <SideNavbar visible={headerVisible} />
          </div>
          <main className="dhwani-site">
            <ScrollExperience onNavVisibility={onJourneyNav} />
            <div ref={nextPage}>
              <div className="events-pin">
                <div className="events-pin__inner">
                  <Events />
                </div>
              </div>
              <CampusAmbassadorBand />
              <DhwaniFooter />
            </div>
          </main>
        </>
      )}
    </ReactLenis>
  );
}