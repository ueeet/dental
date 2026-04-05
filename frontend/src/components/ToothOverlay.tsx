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

    // Fade in tooth
    gsap.to(ref.current, {
      y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.15,
    });

    // Fade in glow behind tooth, then pulse
    gsap.to(".hero-glow", {
      opacity: 1,
      duration: 0.8,
      ease: "power2.inOut",
      delay: 0.3,
      onComplete: () => {
        gsap.to(".hero-glow", {
          scale: 1.2,
          opacity: 0.7,
          duration: 3.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      },
    });

    // Parallax scroll
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
      {/* ── Glow behind tooth (z-index lower than canvas) ── */}
      <div className="absolute inset-0 z-[1]">
        <div
          className="hero-glow absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "clamp(280px, 50vw, 630px)",
            height: "clamp(160px, 28vw, 360px)",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.54) 40%, transparent 70%)",
            filter: "blur(35px)",
            opacity: 0,
            willChange: "transform, opacity",
          }}
        />
        <div
          className="hero-glow absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "clamp(400px, 75vw, 990px)",
            height: "clamp(230px, 45vw, 585px)",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(220,235,255,0.68) 0%, rgba(180,210,250,0.32) 45%, transparent 70%)",
            filter: "blur(55px)",
            opacity: 0,
            willChange: "transform, opacity",
          }}
        />
        <div
          className="hero-glow absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "clamp(500px, 100vw, 1620px)",
            height: "clamp(280px, 60vw, 900px)",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(160,190,240,0.36) 0%, rgba(130,165,220,0.16) 40%, transparent 65%)",
            filter: "blur(80px)",
            opacity: 0,
            willChange: "transform, opacity",
          }}
        />
      </div>

      {/* ── 3D Tooth (z-index higher, on top of glow) ── */}
      <div className="hero-tooth-scroll relative z-[2] h-full w-full">
        <ToothScene onReady={handleReady} />
      </div>
    </div>
  );
}
