import type { Note, NoteType } from "../types/omr";

interface NoteSymbolLayerProps {
  notes: Note[];
  threshold: number;
  originalWidth: number;
  originalHeight: number;
}

function noteColor(note: Note, threshold: number): string {
  if (note.user_correction !== null) return "#22c55e";
  if (note.prediction.probability < threshold / 100) return "#ef4444";
  return "#3b82f6";
}

function isOpenHead(type: NoteType): boolean {
  return type === "whole" || type === "half";
}

function accidentalGlyph(acc: "sharp" | "flat" | "natural" | null): string {
  if (acc === "sharp")   return "♯";
  if (acc === "flat")    return "♭";
  if (acc === "natural") return "♮";
  return "";
}

export function NoteSymbolLayer({ notes, threshold, originalWidth, originalHeight }: NoteSymbolLayerProps) {
  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 12,
        overflow: "visible",
      }}
      viewBox={`0 0 ${originalWidth} ${originalHeight}`}
      preserveAspectRatio="none"
    >
      {notes.map((note) => {
        const { bbox, stem_bbox } = note.location;
        const displayNote = note.user_correction ?? note.prediction;
        const type = displayNote.type;
        const color = noteColor(note, threshold);

        const cx = bbox.x + bbox.width  / 2;
        const cy = bbox.y + bbox.height / 2;

        // Whole notes are wider and flatter than half/quarter
        const isWhole = type === "whole";
        const rx = Math.max(bbox.width  / 2, 4) * (isWhole ? 1.25 : 1.0);
        const ry = Math.max(bbox.height / 2, 3) * (isWhole ? 0.70 : 1.0);

        const open     = isOpenHead(type);
        const strokeW  = Math.max(ry * 0.44, 1.4);
        const tilt     = isWhole ? 0 : -20; // whole notes sit horizontal

        const acc      = accidentalGlyph(note.render.accidental);
        const dotR     = Math.max(ry * 0.30, 1.2);

        return (
          <g key={note.id} opacity={0.93}>

            {/* ── Stem ─────────────────────────────────────────────── */}
            {stem_bbox && (
              <rect
                x={stem_bbox.x}
                y={stem_bbox.y}
                width={Math.max(stem_bbox.width, 1.5)}
                height={stem_bbox.height}
                fill={color}
              />
            )}

            {/* ── Note head ────────────────────────────────────────── */}
            <ellipse
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              fill={open ? "none" : color}
              stroke={open ? color : "none"}
              strokeWidth={open ? strokeW : 0}
              transform={tilt !== 0 ? `rotate(${tilt}, ${cx}, ${cy})` : undefined}
            />

            {/* ── Accidental ───────────────────────────────────────── */}
            {acc !== "" && (
              <text
                x={bbox.x - 2}
                y={cy + ry * 0.45}
                textAnchor="end"
                fontSize={bbox.height * 1.5}
                fill={color}
                opacity={0.92}
                fontFamily="serif"
              >
                {acc}
              </text>
            )}

            {/* ── Augmentation dots ────────────────────────────────── */}
            {note.render.dots >= 1 && (
              <circle
                cx={bbox.x + bbox.width + 3}
                cy={cy - ry * 0.2}
                r={dotR}
                fill={color}
              />
            )}
            {note.render.dots >= 2 && (
              <circle
                cx={bbox.x + bbox.width + 7}
                cy={cy - ry * 0.2}
                r={dotR}
                fill={color}
              />
            )}

          </g>
        );
      })}
    </svg>
  );
}
