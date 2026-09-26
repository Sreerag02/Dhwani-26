import { useEffect, useState } from "react";

// Intersection alone cannot detect a hidden scene inside the sticky viewport.
// Combine viewport, tab, and timeline visibility; update React only at boundaries.
export default function useSceneActive(ref, progress = null, start = -Infinity, end = Infinity) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    let intersecting = false;
    let previous = false;
    const update = () => {
      const value = progress?.get();
      const next = intersecting && !document.hidden &&
        (!progress || (value >= start && value < end));
      if (next !== previous) {
        previous = next;
        setActive(next);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      update();
    });
    if (ref.current) observer.observe(ref.current);
    const unsubscribe = progress?.on("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      unsubscribe?.();
      document.removeEventListener("visibilitychange", update);
    };
  }, [ref, progress, start, end]);
  return active;
}
