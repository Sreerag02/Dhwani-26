import React from "react";
import { motion, useTransform } from "motion/react";
import "./KhaiPuppet.css";

const KHAI = "/assets/khai/";

/*
 * Puppet rig for Khai. All parts are drawn to one shared 1122x1402 production
 * canvas and stack at (0,0). head.webp lives on its own 1310x1201 canvas, so it
 * is scaled/positioned by the constants below (percentages of the puppet box).
 *
 * Shoulder pivots are canvas percent so each arm rotates around its own joint.
 * Values were fitted against the assembled reference silhouette; nudge them in
 * the browser if a pivot looks off in your build.
 */
export const KH = {
  headWidthPct: 35.7, // head canvas width, % of puppet width (1310px art)
  headLeftPct: 31.6,  // head canvas left edge, % of puppet width
  headTopPct: 6,      // head canvas top edge, % of puppet height
  leftPivot: { x: 40.5, y: 31.5 },
  rightPivot: { x: 67.5, y: 25.3 },
  leftSwing: [0, -14],
  rightSwing: [0, 12],
  hair: 3,            // hair-*.webp variant (1 | 2 | 3), 0 = none
};

const POS = { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" };

export default React.memo(function KhaiPuppet({ progress, reduced }) {
  const leftRotate = useTransform(progress, [0.62, 0.94], KH.leftSwing);
  const rightRotate = useTransform(progress, [0.62, 0.94], KH.rightSwing);
  const handStyle = (pivot, rotate) => ({
    ...POS,
    rotate: reduced ? 0 : rotate,
    transformOrigin: `${pivot.x}% ${pivot.y}%`,
  });
  const headStyle = {
    position: "absolute",
    left: KH.headLeftPct + "%",
    top: KH.headTopPct + "%",
    width: KH.headWidthPct + "%",
    height: "auto",
    zIndex: 1,
  };
  return (
    <div className="khai-puppet">
      {/* <img className="khai-puppet-layer" src={KHAI + "outfits.webp"} alt="" draggable="false" style={POS} /> */}
      {KH.hair > 0 && (
        <img className="khai-puppet-layer" src={KHAI + "hair-" + KH.hair + ".webp"} alt="" draggable="false" style={{...POS, top: "-6%", transform: `scale(0.9)`, zIndex: 1}} />
      )}
      <img className="khai-puppet-layer" src={KHAI + "head.webp"} alt="" draggable="false" style={headStyle} />
      <div style={{ ...POS, left: "-32%", top: "-6%", transform: `scaleX(-1) scale(0.8)`, transformOrigin: `${100 - KH.leftPivot.x}% ${KH.leftPivot.y}%` }}>
        <motion.img className="khai-puppet-layer"
          src={KHAI + "left-hand.webp"} alt="" draggable="false"
          style={handStyle(KH.leftPivot, leftRotate)} />
      </div>
      <div style={{ ...POS, left: "+46%", transform: `scaleX(-1) scale(0.7)`, transformOrigin: `${100 - KH.rightPivot.x}% ${KH.rightPivot.y}%` }}>
        <motion.img className="khai-puppet-layer"
          src={KHAI + "right-hand.webp"} alt="" draggable="false"
          style={handStyle(KH.rightPivot, rightRotate)} />
      </div>
      <img className="khai-puppet-layer" src={KHAI + "body.webp"} alt="" draggable="false" style={POS} />
    </div>
  );
});