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
 * `fadeIn`    Progress range [from, to] for the fade-in opacity.
 * `fadeOut`   Progress range [from, to] for the fade-out opacity.
 *
 * The video element is muted + playsInline so autoplay policies never block
 * it. currentTime is set synchronously on every scroll tick, giving a
 * frame-perfect scrub in both directions.
 */
export default function VideoTransition({ progress, src, start, end, fadeIn, fadeOut }) {
  const videoRef = useRef(null);

  // Once the video metadata is ready we can compute the duration-scaled time.
  // We store duration in a ref to avoid re-subscribing to the MotionValue.
  const durationRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onMeta = () => { durationRef.current = video.duration; };
    video.addEventListener("loadedmetadata", onMeta);
    // If metadata already loaded (cached), grab duration immediately.
    if (video.readyState >= 1) durationRef.current = video.duration;
    return () => video.removeEventListener("loadedmetadata", onMeta);
  }, []);

  // Scrub currentTime in sync with scroll.
  useMotionValueEvent(progress, "change", (v) => {
    const video = videoRef.current;
    const duration = durationRef.current;
    if (!video || !duration) return;
    const t = Math.max(0, Math.min(1, (v - start) / (end - start)));
    video.currentTime = t * duration;
  });

  return (
    <div className="video-transition" aria-hidden="true">
      {/* Cinematic letterbox bars */}
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
      {/* Overlay text – purely decorative */}
      <div className="video-transition__label">
        <span>THE VIBE</span>
      </div>
    </div>
  );
}
