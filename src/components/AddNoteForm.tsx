import { useState } from "react";
import type { NoteStep, AlterValue, NoteType } from "../types/omr";

interface AddNoteFormProps {
  anchorX: number;
  anchorY: number;
  onSubmit: (step: NoteStep, octave: number, alter: AlterValue, type: NoteType) => void;
  onClose: () => void;
}

const STEPS: NoteStep[] = ["C", "D", "E", "F", "G", "A", "B"];
const TYPES: NoteType[] = ["whole", "half", "quarter", "eighth", "16th", "32nd"];
const TYPE_LABELS: Record<NoteType, string> = {
  whole: "Whole", half: "Half", quarter: "Quarter",
  eighth: "Eighth", "16th": "16th", "32nd": "32nd",
};
const ALTER_OPTIONS: [AlterValue, string][] = [[-1, "♭"], [0, "♮"], [1, "♯"]];

const FORM_WIDTH = 300;
const FORM_HEIGHT_APPROX = 330;

export function AddNoteForm({ anchorX, anchorY, onSubmit, onClose }: AddNoteFormProps) {
  const [step, setStep]   = useState<NoteStep>("C");
  const [octave, setOctave] = useState(4);
  const [alter, setAlter] = useState<AlterValue>(0);
  const [type, setType]   = useState<NoteType>("quarter");

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let left = anchorX - FORM_WIDTH / 2;
  let top  = anchorY - FORM_HEIGHT_APPROX - 8;
  if (left < 8) left = 8;
  if (left + FORM_WIDTH > vw - 8) left = vw - FORM_WIDTH - 8;
  if (top < 8) top = anchorY + 20;
  if (top + FORM_HEIGHT_APPROX > vh - 8) top = vh - FORM_HEIGHT_APPROX - 8;

  const activeStyle: React.CSSProperties = {
    background: "#f59e0b",
    color: "#0f1117",
    border: "1px solid #f59e0b",
    fontWeight: 500,
    borderRadius: 5,
    padding: "4px 10px",
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: "0.78rem",
    cursor: "pointer",
  };

  const inactiveStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    color: "rgba(255,255,255,0.65)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 5,
    padding: "4px 10px",
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: "0.78rem",
    cursor: "pointer",
  };

  const sectionLabel: React.CSSProperties = {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: "0.6rem",
    color: "rgba(255,255,255,0.32)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 6,
  };

  const pitchPreview = `${step}${alter === 1 ? "♯" : alter === -1 ? "♭" : ""}${octave}`;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />
      <div
        className="popup-enter fixed z-50 rounded-xl shadow-2xl"
        style={{ left, top, width: FORM_WIDTH, background: "#1a1d27", border: "1px solid rgba(255,255,255,0.08)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 700, fontSize: "1.1rem", color: "#22c55e", lineHeight: 1.2 }}>
            Add Note
          </p>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-white/10" style={{ color: "rgba(255,255,255,0.5)" }} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-4 pt-3 pb-4 flex flex-col gap-3">

          {/* Step */}
          <div>
            <p style={sectionLabel}>Pitch</p>
            <div className="flex gap-1 flex-wrap">
              {STEPS.map((s) => (
                <button key={s} onClick={() => setStep(s)} style={step === s ? activeStyle : inactiveStyle}>{s}</button>
              ))}
            </div>
          </div>

          {/* Octave */}
          <div>
            <p style={sectionLabel}>Octave</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOctave((o) => Math.max(0, o - 1))}
                style={{ ...inactiveStyle, padding: "4px 14px" }}
                aria-label="Decrease octave"
              >−</button>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "1rem", color: "#f59e0b", minWidth: 24, textAlign: "center" }}>
                {octave}
              </span>
              <button
                onClick={() => setOctave((o) => Math.min(8, o + 1))}
                style={{ ...inactiveStyle, padding: "4px 14px" }}
                aria-label="Increase octave"
              >+</button>
            </div>
          </div>

          {/* Accidental */}
          <div>
            <p style={sectionLabel}>Accidental</p>
            <div className="flex gap-1">
              {ALTER_OPTIONS.map(([a, label]) => (
                <button key={a} onClick={() => setAlter(a)} style={alter === a ? activeStyle : inactiveStyle}>{label}</button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <p style={sectionLabel}>Duration</p>
            <div className="flex gap-1 flex-wrap">
              {TYPES.map((t) => (
                <button key={t} onClick={() => setType(t)} style={type === t ? activeStyle : inactiveStyle}>
                  {TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-lg px-3 py-2 flex items-center justify-center gap-2"
            style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "1.1rem", fontWeight: 500, color: "#22c55e" }}>
              {pitchPreview}
            </span>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.8rem", color: "rgba(34,197,94,0.6)" }}>
              {TYPE_LABELS[type]}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg py-2 hover:bg-white/10 transition-colors"
              style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit(step, octave, alter, type)}
              className="flex-1 rounded-lg py-2 transition-colors hover:brightness-110"
              style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.78rem", fontWeight: 500, background: "#22c55e", color: "#0f1117", border: "none" }}
            >
              Add Note
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
