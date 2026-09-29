import { useRef, useState } from "react";
import { useMotionValueEvent } from "motion/react";

// Mount just ahead of a scene, release it after it clears, and restore it when
// scrolling backwards. Only boundary crossings trigger React renders.
export default function useProgressWindow(progress, start, end) {
  const inside = value => value >= start && value < end;
  const [mounted, setMounted] = useState(() => inside(progress.get()));
  const previous = useRef(mounted);
  useMotionValueEvent(progress, "change", value => {
    const next = inside(value);
    if (next !== previous.current) {
      previous.current = next;
      setMounted(next);
    }
  });
  return mounted;
}
