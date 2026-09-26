import { useEffect, useRef, useState } from "react";
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

function LenisFramerSync() {
  const lenis = useLenis();
  useAnimationFrame((time) => {
    lenis?.raf(time);
  });
  return null;
}

export default function App() {
  const nextPage = useRef(null);
  const [showHeader, setShowHeader] = useState(false);
  useEffect(() => {
    const el = nextPage.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowHeader(entry.isIntersecting || entry.boundingClientRect.top <= 1),
      { threshold: 0, rootMargin: '0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }} autoRaf={false}>
      <LenisFramerSync />
      {isCampusAmbassadorPage ? (
        <>
          <div className="global-navigation"><SideNavbar /></div>
          <main className="dhwani-site">
            <CampusAmbassador />
            <DhwaniFooter />
          </main>
        </>
      ) : (
        <>
          {showHeader && <div className="global-navigation"><SideNavbar /></div>}
          <main className="dhwani-site">
            <ScrollExperience />
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