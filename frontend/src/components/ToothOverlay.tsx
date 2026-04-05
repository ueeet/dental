"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ToothScene = dynamic(() => import("./ToothScene"), { ssr: false });

export default function ToothOverlay() {
  const ref = useRef<HTMLDivElement>(null);
  const animDone = useRef(false);

  const handleReady = () => {
    if (animDone.current || !ref.current) return;
    animDone.current = true;

    gsap.to(ref.current, {
      y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.15,
    });

    gsap.to(".hero-tooth-scroll", {
      y: "-55%",
      ease: "none",
      scrollTrigger: {
        trigger: ref.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
      },
    });
  };

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-x-0 z-[3] hidden sm:block"
      style={{ top: "25vh", height: "120vh", opacity: 0, transform: "translateY(5%)", willChange: "transform, opacity" }}
    >
      <div className="hero-tooth-scroll h-full w-full">
        <ToothScene onReady={handleReady} />
      </div>
    </div>
  );
}
