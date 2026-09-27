import { useEffect, useState } from "react";

/*
 * Subscribes to a media query. Returns false on the server and before the first
 * effect, so callers should treat the first paint as "unknown" rather than
 * flipping layout twice on load.
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const list = window.matchMedia(query);
    const update = event => setMatches(event.matches);
    setMatches(list.matches);
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, [query]);

  return matches;
}
