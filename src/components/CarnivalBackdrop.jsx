import { useRef } from "react";
import useSceneActive from "../hooks/useSceneActive";
import "./CarnivalBackdrop.css";

export default function CarnivalBackdrop() {
  const ref = useRef(null);
  const active = useSceneActive(ref);
  return (
    <div ref={ref} data-animation-paused={!active} className="carnival-backdrop" aria-hidden="true">
      <img loading="lazy" decoding="async"
        src="/assets/runtime/merch/bg/bg element.webp"
        alt=""
        draggable="false"
        className="cb-texture"
      />
      <img loading="lazy" decoding="async"
        src="/assets/merch/cloud/cloud3.webp"
        alt=""
        draggable="false"
        className="cb-cloud cb-cloud--left-btm"
      />
      <img loading="lazy" decoding="async"
        src="/assets/merch/cloud/Cloud7.webp"
        alt=""
        draggable="false"
        className="cb-cloud cb-cloud--right-mid"
      />
      <img loading="lazy" decoding="async"
        src="/assets/merch/cloud/cloud2.webp"
        alt=""
        draggable="false"
        className="cb-cloud cb-cloud--top-left"
      />
      <img loading="lazy" decoding="async"
        src="/assets/merch/cloud/cloud5.webp"
        alt=""
        draggable="false"
        className="cb-cloud cb-cloud--top-right"
      />
      <img loading="lazy" decoding="async"
        src="/assets/merch/cloud/cloud1.webp"
        alt=""
        draggable="false"
        className="cb-cloud cb-cloud--low-right"
      />
      <img loading="lazy" decoding="async"
        src="/assets/merch/cloud/cloud4.webp"
        alt=""
        draggable="false"
        className="cb-cloud cb-cloud--bottom-left"
      />
      <img loading="lazy" decoding="async"
        src="/assets/merch/cloud/cloud6.webp"
        alt=""
        draggable="false"
        className="cb-cloud cb-cloud--bottom-right"
      />
      <img loading="lazy" decoding="async"
        src="/assets/merch/lantern/lantern.webp"
        alt=""
        draggable="false"
        className="cb-lantern"
      />
      <img loading="lazy" decoding="async"
        src="/assets/merch/lantern/lantern1.webp"
        alt=""
        draggable="false"
        className="cb-lantern cb-lantern--l1"
      />
      <img loading="lazy" decoding="async"
        src="/assets/merch/lantern/lantern3.webp"
        alt=""
        draggable="false"
        className="cb-lantern cb-lantern--l3"
      />
      <img loading="lazy" decoding="async"
        src="/assets/merch/lantern/lantern 2.webp"
        alt=""
        draggable="false"
        className="cb-lantern cb-lantern--l2"
      />
    </div>
  );
}