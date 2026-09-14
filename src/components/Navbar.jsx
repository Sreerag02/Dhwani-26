import { AnimatePresence, motion } from "motion/react";
import { Menu, Ticket, X } from "lucide-react";
import { useState } from "react";

const navigation = [
  { number: "01", name: "About CET", href: "#about-cet" },
  { number: "02", name: "Dhwani", href: "#about-dhwani" },
  { number: "03", name: "Events", href: "#events" },
  { number: "04", name: "Talks", href: "#talks" },
  { number: "05", name: "Sponsors", href: "#sponsors" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 border-b-2
                   border-[#FABF01] bg-[#1F1D66]"
      >
        {/* Palette strip */}
        <div className="grid h-1 grid-cols-7">
          <span className="bg-[#1F1D66]" />
          <span className="bg-[#3731AB]" />
          <span className="bg-[#9D34D1]" />
          <span className="bg-[#AF005F]" />
          <span className="bg-[#FABF01]" />
          <span className="bg-[#005ED2]" />
          <span className="bg-[#02CAEF]" />
        </div>

        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center px-5 md:px-10">
          {/* Brand */}
          <a
            href="#home"
            className="flex h-full items-center gap-4"
            aria-label="Dhwani 26 home"
          >
            <img
              src="/assets/logo/dhwani-main.png"
              alt="Dhwani 26"
              className="h-11 w-auto object-contain md:h-13"
            />

            <div className="hidden border-l border-white/25 pl-4 sm:block">
              <p className="m-0 text-[10px] font-semibold tracking-[0.2em] text-[#02CAEF]">
                COLLEGE OF ENGINEERING
              </p>

              <p className="m-0 mt-1 text-[10px] tracking-[0.18em] text-white/60">
                TRIVANDRUM
              </p>
            </div>
          </a>

          {/* Desktop navigation */}
          <nav className="ml-auto hidden h-full items-center lg:flex">
            {navigation.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                whileHover={{ y: -3 }}
                className="group relative flex h-full items-center
                           border-l border-white/10 px-5"
              >
                <span
                  className="absolute left-3 top-3 text-[9px]
                             font-bold text-[#02CAEF]
                             transition-colors group-hover:text-[#FABF01]"
                >
                  {item.number}
                </span>

                <span
                  className="mt-2 text-[13px] font-semibold uppercase
                             tracking-[0.08em] text-white/75
                             transition-colors group-hover:text-white"
                >
                  {item.name}
                </span>

                <span
                  className="absolute inset-x-0 bottom-0 h-[3px]
                             origin-left scale-x-0 bg-[#AF005F]
                             transition-transform duration-300
                             group-hover:scale-x-100"
                />
              </motion.a>
            ))}

            <motion.a
              href="#tickets"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.96 }}
              style={{
                clipPath:
                  "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
              }}
              className="ml-5 flex items-center gap-2 bg-[#FABF01]
                         px-6 py-3.5 text-sm font-bold uppercase
                         tracking-[0.08em] text-[#1F1D66]"
            >
              <Ticket size={17} strokeWidth={2.5} />
              Tickets
            </motion.a>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation"
            className="ml-auto flex h-11 w-11 items-center justify-center
                       border-2 border-[#FABF01] bg-transparent
                       text-[#FABF01] lg:hidden"
          >
            <Menu size={23} />
          </button>
        </div>
      </motion.header>

      {/* Mobile navigation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] flex flex-col bg-[#1F1D66] lg:hidden"
          >
            <div className="grid h-2 grid-cols-4">
              <span className="bg-[#9D34D1]" />
              <span className="bg-[#AF005F]" />
              <span className="bg-[#FABF01]" />
              <span className="bg-[#02CAEF]" />
            </div>

            <div
              className="flex h-[76px] items-center justify-between
                         border-b border-white/20 px-5"
            >
              <img
                src="/assets/logo/dhwani-main.png"
                alt="Dhwani 26"
                className="h-11 w-auto"
              />

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation"
                className="flex h-11 w-11 items-center justify-center
                           bg-[#FABF01] text-[#1F1D66]"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center px-6">
              {navigation.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 + index * 0.07 }}
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-center gap-5 border-b
                             border-white/15 py-5"
                >
                  <span className="text-xs font-bold text-[#02CAEF]">
                    {item.number}
                  </span>

                  <span
                    className="text-3xl font-bold uppercase tracking-tight
                               text-white transition-colors
                               group-hover:text-[#FABF01]"
                  >
                    {item.name}
                  </span>
                </motion.a>
              ))}
            </nav>

            <a
              href="#tickets"
              onClick={() => setMenuOpen(false)}
              className="m-6 flex items-center justify-center gap-3
                         bg-[#FABF01] px-5 py-4 font-bold uppercase
                         tracking-[0.1em] text-[#1F1D66]"
            >
              <Ticket size={19} />
              Get Tickets
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;