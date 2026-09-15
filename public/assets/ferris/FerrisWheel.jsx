import { useEffect, useMemo, useRef } from "react";
import "./FerrisWheel.css";

const VIEW_W = 2914;
const VIEW_H = 3067;
const CX = 1455.4923;
const CY = 1317.0419;
const R_PX = 1303.559493;

// Attachment angles extracted from your original SVG. 0 = top; + = clockwise.
const CABINS = [{"file":"/assets/ferris/cabins/cabin-01.png","cropW":309,"cropH":412,"pivotX":154.5,"pivotY":15.253,"baseAngle":0.508070722},{"file":"/assets/ferris/cabins/cabin-02.png","cropW":309,"cropH":412,"pivotX":154.5,"pivotY":15.253,"baseAngle":1.031172081},{"file":"/assets/ferris/cabins/cabin-03.png","cropW":305,"cropH":412,"pivotX":154.5,"pivotY":15.253,"baseAngle":1.554127387},{"file":"/assets/ferris/cabins/cabin-04.png","cropW":309,"cropH":412,"pivotX":154.5,"pivotY":15.253,"baseAngle":2.075566868},{"file":"/assets/ferris/cabins/cabin-05.png","cropW":309,"cropH":411,"pivotX":154.5,"pivotY":15.253,"baseAngle":2.596868785},{"file":"/assets/ferris/cabins/cabin-06.png","cropW":309,"cropH":408,"pivotX":154.5,"pivotY":15.253,"baseAngle":3.125222929},{"file":"/assets/ferris/cabins/cabin-07.png","cropW":309,"cropH":412,"pivotX":154.5,"pivotY":15.253,"baseAngle":3.652508179},{"file":"/assets/ferris/cabins/cabin-08.png","cropW":310,"cropH":411,"pivotX":155.0,"pivotY":15.253,"baseAngle":4.17990136},{"file":"/assets/ferris/cabins/cabin-09.png","cropW":306,"cropH":412,"pivotX":151.0,"pivotY":15.253,"baseAngle":4.703028102},{"file":"/assets/ferris/cabins/cabin-10.png","cropW":310,"cropH":412,"pivotX":155.0,"pivotY":15.253,"baseAngle":5.223376992},{"file":"/assets/ferris/cabins/cabin-11.png","cropW":310,"cropH":412,"pivotX":155.0,"pivotY":15.253,"baseAngle":5.74484218},{"file":"/assets/ferris/cabins/cabin-12.png","cropW":310,"cropH":408,"pivotX":155.0,"pivotY":11.253,"baseAngle":6.272852988}];

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/**
 * FerrisWheel
 *
 * Physics:
 * - the wheel rotates about its true axle;
 * - each gondola pivot orbits with the wheel;
 * - each gondola is a damped pendulum under gravity;
 * - pivot acceleration (centripetal + motor acceleration) drives natural lag/swing;
 * - gondolas therefore remain upright at normal speed but can swing subtly while starting/stopping.
 */
export default function FerrisWheel({
  duration = 48,       // seconds per revolution once up to speed
  rampSeconds = 4.5,   // smooth motor start
  gravity = 9.81,
  wheelRadiusM = 20,
  pendulumLengthM = 2.4,
  damping = 1.15,
  running = true,
  className = "",
}) {
  const rootRef = useRef(null);
  const rotorRef = useRef(null);
  const cabinRefs = useRef([]);

  const state = useMemo(
    () => CABINS.map(() => ({ phi: 0, phiDot: 0 })),
    []
  );

  useEffect(() => {
    const root = rootRef.current;
    const rotor = rotorRef.current;
    if (!root || !rotor) return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduceMotion || !running) {
      rotor.style.transform = "rotate(0rad)";
      cabinRefs.current.forEach((node, i) => {
        if (!node) return;
        const a = CABINS[i].baseAngle;
        const x = CX + R_PX * Math.sin(a);
        const y = CY - R_PX * Math.cos(a);
        node.style.left = `${(x / VIEW_W) * 100}%`;
        node.style.top = `${(y / VIEW_H) * 100}%`;
        node.style.setProperty("--swing", "0rad");
      });
      return;
    }

    let raf = 0;
    let last = performance.now();
    let elapsed = 0;
    let theta = 0;
    let omega = 0;

    // Stable integration: cap dt and split into small substeps.
    const targetOmega = (2 * Math.PI) / Math.max(8, duration);
    const ramp = Math.max(0.25, rampSeconds);
    const Rm = Math.max(1, wheelRadiusM);
    const L = Math.max(0.3, pendulumLengthM);
    const g = Math.max(0.1, gravity);
    const damp = Math.max(0, damping);

    const frame = (now) => {
      const dtFrame = clamp((now - last) / 1000, 0, 0.05);
      last = now;
      elapsed += dtFrame;

      // Half-cosine speed ramp: zero jerk at the beginning/end of the ramp.
      const q = clamp(elapsed / ramp, 0, 1);
      const speedFactor = 0.5 - 0.5 * Math.cos(Math.PI * q);
      const previousOmega = omega;
      omega = targetOmega * speedFactor;
      const alpha = dtFrame > 0 ? (omega - previousOmega) / dtFrame : 0;
      theta = (theta + omega * dtFrame) % (2 * Math.PI);

      rotor.style.transform = `rotate(${theta}rad)`;

      const steps = Math.max(1, Math.ceil(dtFrame / 0.008));
      const h = dtFrame / steps;

      CABINS.forEach((cabin, i) => {
        const s = state[i];
        let a = cabin.baseAngle + theta;

        for (let step = 0; step < steps; step += 1) {
          // Pivot acceleration in world coordinates (x right, y down), in m/s².
          const xDD = -Rm * omega * omega * Math.sin(a) + Rm * alpha * Math.cos(a);
          const yDD =  Rm * omega * omega * Math.cos(a) + Rm * alpha * Math.sin(a);

          // Driven pendulum equation, phi measured from vertical-down.
          const phiDD =
            (-xDD * Math.cos(s.phi) + yDD * Math.sin(s.phi) - g * Math.sin(s.phi)) / L
            - damp * s.phiDot;

          s.phiDot += phiDD * h;
          s.phi += s.phiDot * h;

          // Safety clamp only; normal motion stays far inside this range.
          s.phi = clamp(s.phi, -0.32, 0.32);
          s.phiDot = clamp(s.phiDot, -1.6, 1.6);
        }

        const x = CX + R_PX * Math.sin(a);
        const y = CY - R_PX * Math.cos(a);
        const node = cabinRefs.current[i];
        if (!node) return;
        node.style.left = `${(x / VIEW_W) * 100}%`;
        node.style.top = `${(y / VIEW_H) * 100}%`;
        node.style.setProperty("--swing", `${s.phi}rad`);
      });

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [duration, rampSeconds, gravity, wheelRadiusM, pendulumLengthM, damping, running, state]);

  return (
    <div
      ref={rootRef}
      className={`ferrisPhysics ${className}`}
      aria-label="Animated Ferris wheel"
    >
      <img
        className="ferrisPhysics__rotor"
        ref={rotorRef}
        src="/assets/ferris/rotor.svg"
        alt=""
        draggable="false"
      />

      {CABINS.map((cabin, i) => (
        <div
          className="ferrisPhysics__cabinPivot"
          key={cabin.file}
          ref={(node) => { cabinRefs.current[i] = node; }}
        >
          <img
            className="ferrisPhysics__cabin"
            src={cabin.file}
            alt=""
            draggable="false"
            style={{
              width: `${(cabin.cropW / VIEW_W) * 100}cqw`,
              transformOrigin: `${(cabin.pivotX / cabin.cropW) * 100}% ${(cabin.pivotY / cabin.cropH) * 100}%`,
              marginLeft: `${-(cabin.pivotX / VIEW_W) * 100}cqw`,
              marginTop: `${-(cabin.pivotY / VIEW_W) * 100}cqw`,
            }}
          />
        </div>
      ))}

      <img
        className="ferrisPhysics__support"
        src="/assets/ferris/support.svg"
        alt=""
        draggable="false"
      />
    </div>
  );
}
