import { useEffect, useRef, useState } from "react";
import SideNavbar from "./components/SideNavbar";
import ScrollExperience from "./sections/ScrollExperience";
import DateReveal from "./sections/DateReveal";

export default function App() {
  const nextPage = useRef(null);
  const [showHeader, setShowHeader] = useState(false);
  useEffect(() => {
    // Keep navigation hidden until the page following the entire pin reaches
    // the viewport top; allow one CSS pixel for fractional svh/scroll rounding.
    // Browsers can stop at a fractional section top at maximum scroll.
    const update = () => setShowHeader(nextPage.current.getBoundingClientRect().top <= 1);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const observer = new ResizeObserver(update);
    observer.observe(document.documentElement);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer.disconnect();
    };
  }, []);
  return <>
    {showHeader && <div className="global-navigation"><SideNavbar /></div>}
    <main className="dhwani-site">
      <ScrollExperience />
      <div ref={nextPage}><DateReveal /></div>
    </main>
  </>;
}
