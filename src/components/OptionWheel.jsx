import { useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import "./OptionWheel.css";

const clampN = (d, n) => {
  let w = ((d % n) + n) % n;
  if (w > n / 2) w -= n;
  return w;
};

export default function OptionWheel({
  items = [],
  defaultSelected = 0,
  textColor = "#a6a6a6",
  activeColor = "#7C3AED",
  side = "right",
  fontSize = 3,
  spacing = 4,
  curve = 2,
  tilt = 12,
  blur = 2,
  fade = 0.25,
  smoothing = 360,
  inset = 120,
  loop = false,
  draggable = true,
  soundUrl = "",
  soundVolume = 0.5,
  onChange = () => {},
}) {
  const n = items.length;
  const reduced = useReducedMotion();
  const box = useRef(null);
  const sent = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [sel, setSel] = useState(defaultSelected);
  const [drag, setDrag] = useState(null); // {id, y, steps}

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const commit = next => {
    if (next === sent.current) return;
    sent.current = next;
    onChange(next, items[next]);
    if (soundUrl && !reduced) {
      try {
        const audio = new Audio(soundUrl);
        audio.volume = soundVolume;
        audio.play().catch(() => {});
        queueMicrotask(() => audio.remove());
      } catch {}
    }
  };

  useLayoutEffect(() => {
    if (sel !== sent.current) setDrag(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel]);

  const R = Math.max(0, curve * 0.16 * Math.min(size.w || 1, size.h || 1));
  const cx = Math.max(0, Math.min(size.w, side === "right" ? size.w - inset : inset));
  const cy = (size.h || 1) / 2;
  const stepRad = (spacing * Math.PI) / 180;
  const distPerStep = Math.max(12, Math.abs(Math.sin(stepRad) * R) || 12);
  const pos = sel + (drag ? drag.steps : 0);

  const place = i => {
    const d = loop ? clampN(i - pos, n) : i - pos;
    const th = d * stepRad;
    const t = Math.min(1, Math.abs(d) / Math.max(1, n - 1));
    const x = cx + (1 - Math.cos(th)) * R * (side === "right" ? 1 : -1);
    const y = cy - Math.sin(th) * R;
    return {
      d,
      x,
      y,
      rotate: -tilt * Math.sin(th) * (side === "right" ? 1 : -1),
      opacity: 1 - t * fade * 2.5,
      blur: t * blur,
      active: Math.abs(d) < 0.5,
    };
  };

  const onPointerDown = event => {
    if (!draggable || reduced) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDrag({ id: event.pointerId, y: event.clientY, steps: 0 });
  };
  const onPointerMove = event => {
    if (!drag || drag.id !== event.pointerId) return;
    const steps = (drag.y - event.clientY) / distPerStep;
    const clamped = loop ? steps : Math.max(-sel, Math.min(n - 1 - sel, steps));
    setDrag({ ...drag, steps: clamped });
  };
  const onPointerUp = event => {
    if (!drag || drag.id !== event.pointerId) return;
    const raw = sel + Math.round(drag.steps);
    const next = loop ? ((raw % n) + n) % n : Math.max(0, Math.min(n - 1, raw));
    setSel(next);
    setDrag(null);
  };

  return (
    <div
      ref={box}
      className={"option-wheel" + (drag ? " option-wheel--drag" : "")}
      style={{ "--ow-text": textColor, "--ow-active": activeColor }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {items.map((item, i) => {
        const p = place(i);
        const style = {
          "--ow-size": fontSize,
          color: p.active ? activeColor : textColor,
          opacity: p.opacity,
          transform: `translate(${p.x}px, ${p.y}px) rotate(${p.rotate}deg) translate(-50%, -50%)`,
          filter: p.blur > 0 ? `blur(${p.blur}px)` : undefined,
          transition: reduced || drag ? "none" : `transform ${smoothing}ms cubic-bezier(.22,1,.36,1), opacity ${smoothing}ms ease, filter ${smoothing}ms ease`,
        };
        return (
          <button
            key={item}
            type="button"
            data-index={i}
            className={"option-wheel__item" + (p.active ? " option-wheel__item--active" : "")}
            style={style}
            onClick={() => commit(i)}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}