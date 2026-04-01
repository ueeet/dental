"use client";

// Fewer photos per row, more breathing room
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

function ImageRow({ images, direction, duration = 40 }: { images: string[]; direction: "left" | "right"; duration?: number }) {
  // Double the images for seamless infinite loop
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
          <div key={i} className="h-[180px] w-[270px] flex-shrink-0 overflow-hidden rounded-xl sm:h-[200px] sm:w-[300px]">
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
  return (
    <section id="about" className="relative overflow-hidden bg-[#1c1f26] py-52 sm:py-60 md:py-72">

      {/* Background image rows */}
      <div className="absolute inset-0 flex flex-col justify-center gap-3 opacity-50">
        <ImageRow images={row1} direction="left" duration={45} />
        <ImageRow images={row2} direction="right" duration={50} />
        <ImageRow images={row3} direction="left" duration={42} />
      </div>

      {/* Subtle dark overlay */}
      <div className="absolute inset-0 bg-[#1c1f26]/40" />

      {/* Centered text */}
      <div className="relative z-10 flex items-center justify-center px-4 sm:px-6">
        <div className="relative mx-auto max-w-2xl text-center">
          {/* Soft radial glow behind text */}
          <div className="absolute -inset-x-24 -inset-y-16 rounded-full bg-[#1c1f26]/70 blur-3xl" />
          <div className="relative px-8 py-12 sm:px-14 sm:py-16">
            <p className="font-[var(--font-mono)] text-xs font-semibold uppercase tracking-widest text-gray-400">
              О клинике
            </p>
            <h2 className="mt-4 text-fluid-h1 font-[var(--font-heading)] font-bold leading-[1.1] tracking-tight text-white">
              Современная стоматология
              <br className="hidden sm:block" />
              {" "}в&nbsp;центре города
            </h2>
            <p className="mt-6 text-base leading-relaxed text-gray-300 sm:text-lg">
              Клиника{" "}
              <span className="font-semibold text-white">IQ&nbsp;Dental</span>{" "}
              переехала по новому адресу —{" "}
              <span className="font-medium text-white">просп.&nbsp;Мира,&nbsp;34</span>.
              Мы создали пространство, где передовые технологии сочетаются
              с&nbsp;комфортной атмосферой.
            </p>

            <a
              href="#services"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-[var(--primary)] px-8 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--primary)] hover:scale-[1.03] active:scale-[0.98]"
            >
              Наши услуги
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
