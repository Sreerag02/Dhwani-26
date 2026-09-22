import { ReactLenis, useLenis } from "lenis/react";
import { useAnimationFrame } from "motion/react";
import "lenis/dist/lenis.css";
import SideNavbar from "./components/SideNavbar";
import CampusAmbassador from "./components/CampusAmbassador";
import ScrollExperience from "./sections/ScrollExperience";
import Events from "./sections/Events";
import CampusAmbassador from "./sections/CampusAmbassador";
import ComingSoon from "./sections/ComingSoon";
import DhwaniFooter from "./components/DhwaniFooter";

function LenisFramerSync() {
  const lenis = useLenis();
  useAnimationFrame((time) => {
    lenis?.raf(time);
  });
  return null;
}

const isCampusAmbassadorPage =
  window.location.pathname.replace(/\/+$/, "") === "/campus-ambassador";

export default function App() {
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
              {/* <ComingSoon /> */}
              <DhwaniFooter />
            </div>
          </main>
        </>
      )}
    </ReactLenis>
  );
}
