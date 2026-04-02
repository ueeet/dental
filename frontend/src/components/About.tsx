"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const row1 = [
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500&h=350&fit=crop",
  "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&h=350&fit=crop",
  "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=500&h=350&fit=crop",
  "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&h=350&fit=crop",
  "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=500&h=350&fit=crop",
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500&h=350&fit=crop",
  "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&h=350&fit=crop",
];
const row2 = [
  "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=500&h=350&fit=crop",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&h=350&fit=crop",
  "https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?w=500&h=350&fit=crop",
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&h=350&fit=crop",
  "https://images.unsplash.com/photo-1629909615850-0a8a2a026e39?w=500&h=350&fit=crop",
  "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=500&h=350&fit=crop",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&h=350&fit=crop",
];
const row3 = [
  "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500&h=350&fit=crop",
  "https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=500&h=350&fit=crop",
  "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=500&h=350&fit=crop",
  "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&h=350&fit=crop",
  "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=500&h=350&fit=crop",
  "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500&h=350&fit=crop",
  "https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=500&h=350&fit=crop",
];

function ImageRow({
  images,
  direction,
  duration = 40,
}: {
  images: string[];
  direction: "left" | "right";
  duration?: number;
}) {
  const doubled = [...images, ...images];
  return (
    <div className="overflow-hidden">
      <div
        className="flex gap-3 will-change-transform"
        style={{
          width: "max-content",
          animation: `${direction === "left" ? "marquee-left" : "marquee-right"} ${duration}s linear infinite`,
        }}
      >
        {doubled.map((src, i) => (
          <div
            key={i}
            className="h-[180px] w-[270px] flex-shrink-0 overflow-hidden rounded-xl sm:h-[200px] sm:w-[300px]"
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Glass text box reveal
      gsap.from(".about-glass", {
        scale: 0.92,
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about-glass",
          start: "top 80%",
          once: true,
        },
      });

      // Badge + heading + paragraph stagger
      gsap.from(".about-text-item", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-glass",
          start: "top 80%",
          once: true,
        },
      });

      // Parallax on the image rows background
      gsap.to(".about-images", {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden bg-[#1c1f26] pt-8 pb-28 sm:py-28 md:pb-36"
    >
      {/* Scrolling clinic images in the background */}
      <div className="about-images absolute inset-0 flex flex-col justify-center gap-3 opacity-40">
        <ImageRow images={row1} direction="left" duration={45} />
        <ImageRow images={row2} direction="right" duration={50} />
        <ImageRow images={row3} direction="left" duration={42} />
      </div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1c1f26]/60 via-[#1c1f26]/30 to-[#1c1f26]/70" />

      {/* Centered glass text card */}
      <div className="relative z-10 flex items-center justify-center px-4 sm:px-6">
        <div
          className="about-glass liquid-glass-dark relative mx-auto max-w-2xl overflow-hidden rounded-3xl px-8 py-12 text-center sm:px-14 sm:py-16"
        >
          {/* Inner accent glow */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

          <p className="about-text-item font-[var(--font-mono)] text-xs font-semibold uppercase tracking-widest text-gray-400">
            О клинике
          </p>

          <h2 className="about-text-item mt-4 text-fluid-h1 font-[var(--font-heading)] font-bold leading-[1.1] tracking-tight text-white">
            Современная стоматология
            <br className="hidden sm:block" /> в&nbsp;центре города
          </h2>

          <p className="about-text-item mt-6 text-base leading-relaxed text-gray-300 sm:text-lg">
            Клиника{" "}
            <span className="font-semibold text-white">IQ&nbsp;Dental</span>{" "}
            переехала по новому адресу —{" "}
            <span className="font-medium text-white">просп.&nbsp;Мира,&nbsp;34</span>.
            Мы создали пространство, где передовые технологии сочетаются
            с&nbsp;комфортной атмосферой.
          </p>

          <a
            href="#services"
            className="about-text-item mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-8 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:bg-[#353d5c] active:scale-[0.98]"
          >
            Наши услуги
          </a>
        </div>
      </div>

      {/* Wave → Services (muted light bg) */}
    </section>
  );
}
