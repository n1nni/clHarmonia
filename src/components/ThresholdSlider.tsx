interface ThresholdSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function ThresholdSlider({ value, onChange }: ThresholdSliderProps) {
  return (
    <div className="flex items-center gap-4">
      <label
        htmlFor="threshold-slider"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: "0.78rem",
          color: "rgba(255,255,255,0.6)",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        Confidence Threshold:
        <span
          style={{
            color: "#f59e0b",
            fontWeight: 500,
            marginLeft: "6px",
          }}
        >
          {value}%
        </span>
      </label>

      <div className="relative flex-1 flex items-center" style={{ minWidth: 140, maxWidth: 240 }}>
        {/* Track background fill */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: 0,
            width: `${value}%`,
            height: "4px",
            background: "linear-gradient(90deg, #b45309, #f59e0b)",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        <input
          id="threshold-slider"
          type="range"
          className="threshold-slider w-full relative z-10"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={`Confidence threshold: ${value}%`}
        />
      </div>
    </div>
  );
}
