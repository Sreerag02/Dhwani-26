import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import HeroReveal from "./components/HeroReveal";
import SideNavbar from "./components/SideNavbar";
import ThemeReveal from "./sections/ThemeReveal";
import DateReveal from "./sections/DateReveal";

function App() {
  const [revealComplete, setRevealComplete] =
    useState(false);

  return (
    <main className="dhwani-site">
      <AnimatePresence>
        {revealComplete && (
          <motion.div
            className="global-navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SideNavbar />
          </motion.div>
        )}
      </AnimatePresence>

      <HeroReveal
        onRevealComplete={() => {
          setRevealComplete(true);
        }}
      />

      {revealComplete && (
        <>
          <ThemeReveal />
          <DateReveal />
        </>
      )}
    </main>
  );
}

export default App;
