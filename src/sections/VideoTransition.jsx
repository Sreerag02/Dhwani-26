import { useEffect, useRef } from "react";
import { useMotionValueEvent } from "motion/react";
import "./VideoTransition.css";

/**
 * VideoTransition — a scroll-scrubbed full-bleed cinematic video.
 *
 * `progress`  MotionValue<number> from the parent scroll experience.
 * `src`       Path to the video file (e.g. "/assets/skate.mp4").
 * `start`     Progress value at which the video starts scrubbing (0-1).
 * `end`       Progress value at which the video reaches its end frame (0-1).
 *
 * The video element is muted + playsInline so autoplay policies never block
 * it. Smooth scrubbing is achieved by lerping currentTime towards the
 * target on every animation frame, avoiding the jitter of raw scroll-driven
 * seeks.
 */
export default function VideoTransition({ progress, src, start, end }) {
  const videoRef = useRef(null);
  const durationRef = useRef(0);
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onMeta = () => { durationRef.current = video.duration; };
    video.addEventListener("loadedmetadata", onMeta);
    if (video.readyState >= 1) durationRef.current = video.duration;
    return () => video.removeEventListener("loadedmetadata", onMeta);
  }, []);

  // Smooth animation loop: lerp currentTime towards targetTime each frame
  useEffect(() => {
    const LERP = 0.18; // smoothing factor (0 = frozen, 1 = instant/raw)
    const tick = () => {
      const video = videoRef.current;
      if (video && durationRef.current) {
        const target = targetTimeRef.current;
        const current = currentTimeRef.current;
        // Lerp towards target; snap if very close to avoid infinite crawl
        const diff = target - current;
        const next = Math.abs(diff) < 0.01 ? target : current + diff * LERP;
        currentTimeRef.current = next;
        video.currentTime = next;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  // Update target time on scroll — no direct seeking, just sets the goal
  useMotionValueEvent(progress, "change", (v) => {
    const duration = durationRef.current;
    if (!duration) return;
    const t = Math.max(0, Math.min(1, (v - start) / (end - start)));
    targetTimeRef.current = t * duration;
  });

  return (
    <div className="video-transition" aria-hidden="true">
      <div className="video-transition__bars" />
      <video
        ref={videoRef}
        className="video-transition__video"
        src={src}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        tabIndex={-1}
      />
    </div>
  );
}
