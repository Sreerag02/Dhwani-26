import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import "./FerrisWheel.css";

const VIEW_W = 2914;
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
  damping = 1.8,
  running = true,
  className = "",
}) {
  const rootRef = useRef(null);
  const rotorRef = useRef(null);
  const cabinRefs = useRef([]);

  const reducedMotion = useReducedMotion();
  const simulationRef = useRef({
    elapsed: 0,
    theta: 0,
    omega: 0,
    cabins: CABINS.map(() => ({ phi: 0, phiDot: 0 })),
  });

  useEffect(() => {
    const rotor = rotorRef.current;
    if (!rotor || reducedMotion || !running) return;

    const simulation = simulationRef.current;
    const state = simulation.cabins;
    let raf = 0;
    let last = performance.now();
    let { elapsed, theta, omega } = simulation;

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
      const steps = Math.max(1, Math.ceil(dtFrame / (1 / 240)));
      const h = dtFrame / steps;

      // Advance the motor and pendulums together at small time steps.
      // Analytic motor acceleration avoids frame-to-frame derivative noise.
      for (let step = 0; step < steps; step += 1) {
        elapsed += h;
        const q = clamp(elapsed / ramp, 0, 1);
        omega = targetOmega * (0.5 - 0.5 * Math.cos(Math.PI * q));
        const alpha = elapsed < ramp
          ? targetOmega * Math.PI / (2 * ramp) * Math.sin(Math.PI * q)
          : 0;
        theta = targetOmega * (elapsed < ramp
          ? elapsed / 2 - ramp / (2 * Math.PI) * Math.sin(Math.PI * q)
          : elapsed - ramp / 2);

        CABINS.forEach((cabin, i) => {
          const s = state[i];
          const a = cabin.baseAngle + theta;
          const xDD = -Rm * omega * omega * Math.sin(a) + Rm * alpha * Math.cos(a);
          const yDD = Rm * omega * omega * Math.cos(a) + Rm * alpha * Math.sin(a);
          const phiDD =
            (-xDD * Math.cos(s.phi) + yDD * Math.sin(s.phi) - g * Math.sin(s.phi)) / L
            - damp * s.phiDot;

          s.phiDot = clamp(s.phiDot + phiDD * h, -1.6, 1.6);
          s.phi = clamp(s.phi + s.phiDot * h, -0.32, 0.32);
        });
      }

      rotor.style.transform = `rotate(${theta}rad)`;
      CABINS.forEach((cabin, i) => {
        const s = state[i];
        const a = cabin.baseAngle + theta;
        const x = CX + R_PX * Math.sin(a);
        const y = CY - R_PX * Math.cos(a);
        const node = cabinRefs.current[i];
        if (!node) return;
        // Container-width units preserve subpixel positions without layout writes.
        node.style.transform = `translate3d(${(x / VIEW_W) * 100}cqw, ${(y / VIEW_W) * 100}cqw, 0) rotate(${-s.phi}rad)`;
      });

      Object.assign(simulation, { elapsed, theta, omega });
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [duration, rampSeconds, gravity, wheelRadiusM, pendulumLengthM, damping, running, reducedMotion]);

  return (
    <div
      ref={rootRef}
      className={`ferrisPhysics ${className}`}
      aria-hidden="true"
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
          style={{
            transform: `translate3d(${((CX + R_PX * Math.sin(cabin.baseAngle)) / VIEW_W) * 100}cqw, ${((CY - R_PX * Math.cos(cabin.baseAngle)) / VIEW_W) * 100}cqw, 0)`,
          }}
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
