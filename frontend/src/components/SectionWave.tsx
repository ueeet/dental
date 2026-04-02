interface SectionWaveProps {
  /** Fill color — must match the NEXT section's background */
  fill: string;
  /** Position: 'bottom' (default) or 'top' */
  position?: "bottom" | "top";
  /** Wave height in px */
  height?: number;
  className?: string;
}

/**
 * Organic SVG wave that sits at the bottom (or top) of a section,
 * coloured to match the next (or previous) section's background —
 * creating a seamless, non-rectangular transition.
 */
export default function SectionWave({
  fill,
  position = "bottom",
  height = 80,
  className = "",
}: SectionWaveProps) {
  const isTop = position === "top";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute left-0 z-10 w-full overflow-hidden leading-[0] ${
        isTop ? "top-0" : "bottom-0"
      } ${className}`}
      style={isTop ? { transform: "scaleY(-1)" } : undefined}
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        style={{ width: "100%", height: `${height}px`, display: "block" }}
      >
        <path
          d="M0,32 C180,72 360,4 540,44 C720,84 900,16 1080,52 C1260,80 1380,28 1440,48 L1440,80 L0,80 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
