"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ToothScene = dynamic(() => import("./ToothScene"), { ssr: false });

/* Inline tooth SVG icon */
function ToothIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 2c-3.5 0-5.5 1.5-7 3s-3 4-3 7c0 4 1.5 7 2.5 10s1 5.5 1.5 7c.3 1 1 1.5 1.8 1.5s1.3-.8 1.7-2c.5-1.5 1-3.5 2.5-3.5s2 2 2.5 3.5c.4 1.2 1 2 1.7 2s1.5-.5 1.8-1.5c.5-1.5.5-4 1.5-7S26 16 26 12c0-3-1.5-5.5-3-7s-3.5-3-7-3z" />
    </svg>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Tooth icon fade in
      tl.from(".hero-tooth-icon", {
        opacity: 0,
        y: -20,
        duration: 0.8,
      });

      // Title lines slide up
      tl.from(
        ".hero-title-line",
        {
          y: 120,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
        },
        "-=0.4"
      );

      // Scroll parallax
      gsap.to(".hero-title-block", {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-white"
    >
      {/* Tooth icon — top left */}
      <div className="hero-tooth-icon absolute left-8 top-8 z-20 sm:left-12 sm:top-10">
        <ToothIcon className="h-8 w-8 text-[#3a3a3a] sm:h-10 sm:w-10" />
      </div>

      {/* 3D Model — right / center, CSS fade-in instead of GSAP */}
      <div
        className="absolute inset-0 z-0 animate-[fadeIn_1.5s_ease-out_0.5s_both]"
      >
        <ToothScene />
      </div>

      {/* Title — bottom left */}
      <div className="hero-title-block absolute bottom-10 left-8 z-10 sm:bottom-16 sm:left-12 lg:bottom-20 lg:left-16">
        <h1 className="font-[var(--font-heading)] font-bold uppercase leading-[0.85] tracking-tight text-[#3a3a3a]">
          <span className="hero-title-line block text-[clamp(3rem,10vw,8rem)]">
            IQ
          </span>
          <span className="hero-title-line block text-[clamp(4rem,13vw,11rem)]">
            DENTAL
          </span>
        </h1>
      </div>
    </section>
  );
}
