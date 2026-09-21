import { useEffect, useRef, useCallback } from "react";
import { useMotionValueEvent } from "motion/react";
import "./VideoTransition.css";

const FRAME_COUNT = 92;
const FRAME_PATH = "/assets/skate-frames/frame-";

const FRAME_SRCS = Array.from({ length: FRAME_COUNT }, (_, i) =>
  `${FRAME_PATH}${String(i + 1).padStart(4, "0")}.webp`
);

/**
 * VideoTransition — scroll-scrubbed canvas image sequence (optimised).
 *
 * Perf notes:
 *  • Canvas context is cached once, not re-acquired every frame.
 *  • ResizeObserver handles canvas sizing instead of per-frame getBoundingClientRect.
 *  • Last-drawn frame index is tracked; duplicate draws are skipped.
 *  • createImageBitmap is used where available for GPU-accelerated blitting.
 *  • rAF loop only runs while the element is in the viewport (IntersectionObserver).
 */
export default function VideoTransition({ progress, start, end }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const imagesRef = useRef([]);
  const bitmapsRef = useRef([]);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const lastDrawnRef = useRef(-1);
  const rafRef = useRef(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const visibleRef = useRef(false);

  // ─── Preload frames + create ImageBitmaps for GPU blitting ────────
  useEffect(() => {
    let cancelled = false;
    const images = FRAME_SRCS.map((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      return img;
    });
    imagesRef.current = images;

    // Progressively create ImageBitmaps as frames load (non-blocking)
    if (typeof createImageBitmap === "function") {
      const bitmaps = new Array(FRAME_COUNT).fill(null);
      bitmapsRef.current = bitmaps;
      images.forEach((img, i) => {
        const create = () => {
          if (cancelled) return;
          createImageBitmap(img).then((bmp) => {
            if (!cancelled) bitmaps[i] = bmp;
          }).catch(() => {});
        };
        if (img.complete) create();
        else img.addEventListener("load", create, { once: true });
      });
    }

    return () => { cancelled = true; };
  }, []);

  // ─── Cache canvas context + track size via ResizeObserver ─────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ctxRef.current = canvas.getContext("2d", { alpha: false });

    const dpr = window.devicePixelRatio || 1;
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      if (sizeRef.current.w !== w || sizeRef.current.h !== h) {
        canvas.width = w;
        canvas.height = h;
        sizeRef.current = { w, h };
        lastDrawnRef.current = -1; // force redraw after resize
      }
    };

    const ro = new ResizeObserver(updateSize);
    ro.observe(canvas);
    updateSize();

    return () => ro.disconnect();
  }, []);

  // ─── Visibility gate: only run rAF when in viewport ───────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const io = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(canvas.parentElement);
    return () => io.disconnect();
  }, []);

  // ─── Draw loop ────────────────────────────────────────────────────
  const draw = useCallback(() => {
    if (visibleRef.current) {
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;
      // Snap if close, otherwise lerp
      const next = Math.abs(diff) < 0.4 ? target : current + diff * 0.5;
      currentFrameRef.current = next;

      const frameIndex = Math.min(Math.round(next), FRAME_COUNT - 1);

      // Skip draw if same frame as last tick
      if (frameIndex !== lastDrawnRef.current) {
        const ctx = ctxRef.current;
        const { w, h } = sizeRef.current;
        // Prefer ImageBitmap (GPU path), fall back to Image
        const bmp = bitmapsRef.current[frameIndex];
        const img = bmp || imagesRef.current[frameIndex];

        if (ctx && w && h && img && (bmp || (img.complete && img.naturalWidth))) {
          const iw = img.width || img.naturalWidth;
          const ih = img.height || img.naturalHeight;
          const imgRatio = iw / ih;
          const canvasRatio = w / h;
          let sx = 0, sy = 0, sw = iw, sh = ih;
          if (imgRatio > canvasRatio) {
            sw = ih * canvasRatio;
            sx = (iw - sw) / 2;
          } else {
            sh = iw / canvasRatio;
            sy = (ih - sh) / 2;
          }
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
          lastDrawnRef.current = frameIndex;
        }
      }
    }
    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [draw]);

  // ─── Scroll → target frame ───────────────────────────────────────
  useMotionValueEvent(progress, "change", (v) => {
    const t = Math.max(0, Math.min(1, (v - start) / (end - start)));
    targetFrameRef.current = t * (FRAME_COUNT - 1);
  });

  return (
    <div className="video-transition" aria-hidden="true">
      <canvas ref={canvasRef} className="video-transition__canvas" />
    </div>
  );
}
