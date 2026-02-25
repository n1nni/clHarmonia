import type { Note, NoteType, AlterValue } from "../types/omr";
import type { ScaleFactors } from "../hooks/useScaleFactors";

interface NoteBoxProps {
  note: Note;
  threshold: number;
  scale: ScaleFactors;
  isSelected: boolean;
  addNoteMode: boolean;
  onClick: (note: Note, x: number, y: number) => void;
}

export function formatAlter(alter: AlterValue): string {
  if (alter === 1) return "♯";
  if (alter === -1) return "♭";
  return "";
}

export function formatPitch(step: string, alter: AlterValue, octave: number): string {
  return `${step}${formatAlter(alter)}${octave}`;
}

export function noteTypeSymbol(type: NoteType): string {
  switch (type) {
    case "whole":   return "𝅝";
    case "half":    return "𝅗𝅥";
    case "quarter": return "♩";
    case "eighth":  return "♪";
    case "16th":    return "𝅘𝅥𝅮";
    case "32nd":    return "𝅘𝅥𝅯";
  }
}

function getNoteColor(note: Note, threshold: number): {
  border: string;
  bg: string;
  bgHover: string;
  ring: string;
} {
  if (note.user_correction !== null) {
    return {
      border: "#22c55e",
      bg: "rgba(34,197,94,0.06)",
      bgHover: "rgba(34,197,94,0.18)",
      ring: "rgba(34,197,94,0.5)",
    };
  }
  if (note.prediction.probability < threshold / 100) {
    return {
      border: "#ef4444",
      bg: "rgba(239,68,68,0.06)",
      bgHover: "rgba(239,68,68,0.18)",
      ring: "rgba(239,68,68,0.5)",
    };
  }
  return {
    border: "#3b82f6",
    bg: "rgba(59,130,246,0.06)",
    bgHover: "rgba(59,130,246,0.18)",
    ring: "rgba(59,130,246,0.5)",
  };
}

export function NoteBox({ note, threshold, scale, isSelected, addNoteMode, onClick }: NoteBoxProps) {
  const { bbox } = note.location;
  const color = getNoteColor(note, threshold);

  const left   = bbox.x * scale.scaleX;
  const top    = bbox.y * scale.scaleY;
  const width  = Math.max(bbox.width * scale.scaleX, 18);
  const height = Math.max(bbox.height * scale.scaleY, 12);

  const displayPrediction = note.user_correction ?? note.prediction;
  const pitchLabel = formatPitch(displayPrediction.step, displayPrediction.alter, displayPrediction.octave);
  const typeSymbol = noteTypeSymbol(displayPrediction.type);
  const prob = note.user_correction
    ? null
    : Math.round(note.prediction.probability * 100);

  const labelText = note.user_correction
    ? `${pitchLabel}${typeSymbol} ✓`
    : `${pitchLabel}${typeSymbol} ${prob}%`;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // In add-note mode let the click bubble up to the container
    if (addNoteMode) return;
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    onClick(note, rect.left + rect.width / 2, rect.top);
  };

  return (
    // Fragment: box + floating label are siblings in the parent container
    <>
      {/* Colored bounding box */}
      <div
        className="note-box absolute select-none"
        style={{
          left,
          top,
          width,
          height,
          border: `2px solid ${color.border}`,
          backgroundColor: isSelected ? color.bgHover : color.bg,
          boxShadow: isSelected ? `0 0 0 2px ${color.ring}` : undefined,
          borderRadius: 3,
          zIndex: isSelected ? 20 : 10,
          cursor: addNoteMode ? "crosshair" : "pointer",
        }}
        onClick={handleClick}
        title={labelText}
      />

      {/* Floating label — rendered BELOW the box, centered on it */}
      <div
        style={{
          position: "absolute",
          left: left + width / 2,
          top: top + height + 3,
          transform: "translateX(-50%)",
          background: "rgba(10,11,18,0.88)",
          backdropFilter: "blur(3px)",
          borderRadius: 3,
          padding: "2px 5px",
          whiteSpace: "nowrap",
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 9,
          lineHeight: 1.3,
          color: "#ffffff",
          pointerEvents: "none",
          zIndex: 15,
          border: `1px solid ${color.border}55`,
        }}
      >
        {labelText}
      </div>
    </>
  );
}
