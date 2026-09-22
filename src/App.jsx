import { ReactLenis, useLenis } from "lenis/react";
import { useAnimationFrame } from "motion/react";
import "lenis/dist/lenis.css";
import SideNavbar from "./components/SideNavbar";
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

export default function App() {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }} autoRaf={false}>
      <LenisFramerSync />
      <div className="global-navigation"><SideNavbar /></div>
      <main className="dhwani-site">
        <ScrollExperience />
        <div>
          <Events />
          <CampusAmbassador />
          <ComingSoon />
          <DhwaniFooter />
        </div>
      </main>
    </ReactLenis>
  );
}
