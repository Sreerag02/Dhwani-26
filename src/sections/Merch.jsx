import "./Merch.css";
import { motion, useReducedMotion, useTransform } from "motion/react";

export default function Merch({ progress }) {
  const reduced = useReducedMotion();
  // Pop-in driven by the journey's reveal window: a minimal, gentle pop —
  // each element scales up slightly with a tiny overshoot and lifts a few px,
  // all via the stage's CSS vars (--pop/--rise/--fade) composed through
  // independent props so the elements' own transforms stay untouched.
  const enter = useTransform(progress, [.95, .995], [0, 1]);
  const scale = useTransform(enter, [0, .5, 1], [.94, 1.02, 1]);
  const rise = useTransform(enter, [0, 1], ["10px", "0px"]);
  return (
    <section id="merch" className="merch" aria-label="Dhwani 26 merchandise">
      <motion.div
        className="merch__stage"
        style={reduced ? undefined : { "--pop": scale, "--rise": rise, "--fade": enter }}
      >
        {/* <div className="merch__bg merch__bg--blue" aria-hidden="true" /> */}
        <div className="merch__bg merch__bg--pink" aria-hidden="true" />
        <img
          src="/assets/merch/bg/bg element.png"
          alt=""
          aria-hidden="true"
          className="merch__bg-element"
          draggable="false"
        />
        <img
          src="/assets/dhwani og 26.png"
          alt="Dhwani 26"
          className="merch__logo"
          draggable="false"
        />
        <img
          src="/assets/tshirt outlne.png"
          alt=""
          className="merch__tee merch__tee--outline"
          draggable="false"
        />
        <img
          src="/assets/t shirt back.png"
          alt="Dhwani 26 t-shirt back"
          className="merch__tee merch__tee--back"
          draggable="false"
        />
        <img
          src="/assets/GET YOUR TEES NOWWW!1.png"
          alt="Get your tees now"
          className="merch__tees-now"
          draggable="false"
        />
        <img
          src="/assets/t shirt front copy.png"
          alt="Dhwani 26 t-shirt front"
          className="merch__tee merch__tee--front-left"
          draggable="false"
        />
        <img
          src="/assets/merch/cloud/cloud3.png"
          alt=""
          className="merch__cloud--left-btm"
          draggable="false"
        />
        <img
          src="/assets/merch/cloud/cloud3.png"
          alt=""
          className="merch__cloud--left-mid"
          draggable="false"
        />
        <img
          src="/assets/merch/cloud/Cloud7.png"
          alt=""
          className="merch__cloud--right-mid"
          draggable="false"
        />
        <img
          src="/assets/merch/cloud/cloud2.png"
          alt=""
          className="merch__cloud--top-left"
          draggable="false"
        />
        <img
          src="/assets/merch/cloud/cloud5.png"
          alt=""
          className="merch__cloud--top-right"
          draggable="false"
        />
        <img
          src="/assets/merch/cloud/cloud1.png"
          alt=""
          className="merch__cloud--low-right"
          draggable="false"
        />
        <img
          src="/assets/blue note.png"
          alt=""
          className="merch__note--blue"
          draggable="false"
        />
        <img
          src="/assets/note red.png"
          alt=""
          className="merch__note--red"
          draggable="false"
        />
        <img
          src="/assets/t shirt front copy.png"
          alt="Dhwani 26 t-shirt front"
          className="merch__tee merch__tee--front-right"
          draggable="false"
        />
        <img
          src="/assets/merch/lantern/L2 copy.png"
          alt=""
          className="merch__lantern merch__lantern--l2"
          draggable="false"
        />
        <img
          src="/assets/merch/lantern/lantern.png"
          alt=""
          className="merch__lantern merch__lantern--plain"
          draggable="false"
        />
        <img
          src="/assets/merch/lantern/lantern3.png"
          alt=""
          className="merch__lantern merch__lantern--three"
          draggable="false"
        />
        <img
          src="/assets/merch/lantern/lantern 2.png"
          alt=""
          className="merch__lantern"
          draggable="false"
        />
        <img
          src="/assets/merch/lantern/lantern1.png"
          alt=""
          className="merch__lantern merch__lantern--one"
          draggable="false"
        />
        <a href="#merch" className="merch__order-btn" role="button">
          Order Now
        </a>
      </motion.div>
    </section>
  );
}

// const MERCH_ORDER_URL = "#"; // TODO: replace with the real order/contact link

// const MERCH_ROWS = [
//   {
//     key: "badges",
//     tag: "Badges",
//     mod: "badges",
//     items: [
//       { src: "/assets/merch/badges/badge-1.webp", alt: "Dhwani 26 badge round 1" },
//       { src: "/assets/merch/badges/badge-2.webp", alt: "Dhwani 26 badge round 2" },
//       { src: "/assets/merch/badges/badge-3.webp", alt: "Dhwani 26 badge round 3" },
//     ],
//   },
//   {
//     key: "bandanas",
//     tag: "Bandanas",
//     mod: "bandanas",
//     items: [
//       { src: "/assets/merch/bandana/bandana-a.webp", alt: "Dhwani 26 bandana design a" },
//       { src: "/assets/merch/bandana/bandana-a2.webp", alt: "Dhwani 26 bandana design a2" },
//       { src: "/assets/merch/bandana/bandana-b.webp", alt: "Dhwani 26 bandana design b" },
//       { src: "/assets/merch/bandana/bandana-b2.webp", alt: "Dhwani 26 bandana design b2" },
//     ],
//   },
//   {
//     key: "fanny",
//     tag: "Fanny Packs",
//     mod: "fanny",
//     items: [
//       { src: "/assets/merch/fanny/fanny-1.webp", alt: "Dhwani 26 fanny pack style 1" },
//       { src: "/assets/merch/fanny/fanny-2.webp", alt: "Dhwani 26 fanny pack style 2" },
//       { src: "/assets/merch/fanny/fanny-3.webp", alt: "Dhwani 26 fanny pack style 3" },
//     ],
//   },
// ];

// export function MerchKit() {
//   return (
//     <div className="merch-kit">
//       <div className="merch-kit__hero">
//         <img
//           src="/assets/MERCH KIT IMAGE.png"
//           alt="Dhwani 26 merch kit"
//           className="merch-kit__image"
//           draggable="false"
//         />
//         <img
//           src="/assets/merch kit.png"
//           alt="Merch kit"
//           className="merch-kit__label"
//           draggable="false"
//         />
//       </div>
//       <img
//         src="/assets/blue note.png"
//         alt=""
//         className="merch-kit__note merch-kit__note--blue"
//         draggable="false"
//       />
//       <img
//         src="/assets/note red.png"
//         alt=""
//         className="merch-kit__note merch-kit__note--red"
//         draggable="false"
//       />
//       <div className="merch-collage">
//         {MERCH_ROWS.map(row => (
//           <div key={row.key} className={`merch-row merch-row--${row.mod}`}>
//             <span className="merch-row__tag">{row.tag}</span>
//             <div className="merch-row__items">
//               {row.items.map(item => (
//                 <img
//                   key={item.src}
//                   src={item.src}
//                   alt={item.alt}
//                   className="merch-item"
//                   draggable="false"
//                 />
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//       <img
//         src="/assets/Download badge, price sticker, label png transparent for free copy 2.png"
//         alt=""
//         className="merch-kit__sticker"
//         draggable="false"
//       />
//       <a
//         href={MERCH_ORDER_URL}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="merch-kit__cta"
//       >
//         Order Now
//       </a>
//     </div>
//   );
// }