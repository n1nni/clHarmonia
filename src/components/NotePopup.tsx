import { useEffect, useRef } from "react";
import type { Note, NoteAlternative, AlterValue, NoteType } from "../types/omr";

interface NotePopupProps {
  note: Note;
  anchorX: number;
  anchorY: number;
  onCorrect: (note: Note, alternative: NoteAlternative) => void;
  onReset: (note: Note) => void;
  onDelete: (note: Note) => void;
  onClose: () => void;
}

function fmtAlter(alter: AlterValue): string {
  if (alter === 1) return "♯";
  if (alter === -1) return "♭";
  return "";
}

function fmtPitch(step: string, alter: AlterValue, octave: number): string {
  return `${step}${fmtAlter(alter)}${octave}`;
}

function fmtTypeSymbol(type: NoteType): string {
  switch (type) {
    case "whole":   return "𝅝";
    case "half":    return "𝅗𝅥";
    case "quarter": return "♩";
    case "eighth":  return "♪";
    case "16th":    return "𝅘𝅥𝅮";
    case "32nd":    return "𝅘𝅥𝅯";
  }
}

function fmtTypeName(type: NoteType): string {
  switch (type) {
    case "whole":   return "Whole";
    case "half":    return "Half";
    case "quarter": return "Quarter";
    case "eighth":  return "Eighth";
    case "16th":    return "16th";
    case "32nd":    return "32nd";
  }
}

const POPUP_WIDTH = 288;
const POPUP_HEIGHT_APPROX = 320;

export function NotePopup({ note, anchorX, anchorY, onCorrect, onReset, onDelete, onClose }: NotePopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let left = anchorX - POPUP_WIDTH / 2;
  let top  = anchorY - POPUP_HEIGHT_APPROX - 8;
  if (left < 8) left = 8;
  if (left + POPUP_WIDTH > vw - 8) left = vw - POPUP_WIDTH - 8;
  if (top < 8) top = anchorY + 24;
  if (top + POPUP_HEIGHT_APPROX > vh - 8) top = vh - POPUP_HEIGHT_APPROX - 8;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const { prediction, alternatives, user_correction } = note;
  const sortedAlts = [...alternatives].sort((a, b) => b.probability - a.probability);

  // Wrap prediction as NoteAlternative so onCorrect can accept it
  const predAsAlt: NoteAlternative = {
    step: prediction.step,
    octave: prediction.octave,
    alter: prediction.alter,
    duration_divisions: prediction.duration_divisions,
    type: prediction.type,
    probability: prediction.probability,
  };

  const sectionLabel: React.CSSProperties = {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: "0.6rem",
    color: "rgba(255,255,255,0.32)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 5,
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />

      <div
        ref={popupRef}
        className="popup-enter fixed z-50 rounded-xl shadow-2xl"
        style={{ left, top, width: POPUP_WIDTH, background: "#1a1d27", border: "1px solid rgba(255,255,255,0.08)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div>
            <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 700, fontSize: "1.1rem", color: "#f59e0b", lineHeight: 1.2 }}>
              Correct Note
            </p>
            <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.6rem", color: "rgba(255,255,255,0.32)", marginTop: 1 }}>
              {note.id}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-white/10" style={{ color: "rgba(255,255,255,0.5)" }} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-4 pt-3 pb-4 flex flex-col gap-3">

          {/* Active correction badge — shown only when corrected */}
          {user_correction && (
            <div className="flex items-center justify-between rounded-lg px-3 py-2"
              style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
              <div>
                <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.58rem", color: "rgba(34,197,94,0.6)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>
                  Corrected to
                </p>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.88rem", fontWeight: 500, color: "#22c55e" }}>
                  {fmtPitch(user_correction.step, user_correction.alter, user_correction.octave)}
                  {" "}{fmtTypeSymbol(user_correction.type)}
                  <span style={{ fontSize: "0.72rem", opacity: 0.65, marginLeft: 5 }}>{fmtTypeName(user_correction.type)}</span>
                </span>
              </div>
              <button
                onClick={() => { onReset(note); onClose(); }}
                className="rounded-md px-2 py-1 hover:bg-white/10 transition-colors"
                style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.65rem", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.12)" }}
                title="Undo correction — revert to original OMR prediction"
              >
                ↺ Undo
              </button>
            </div>
          )}

          {/* Prediction row — always clickable to (re-)confirm it */}
          <div>
            <p style={sectionLabel}>
              {user_correction ? "Original Prediction" : "Current Prediction"}
            </p>
            <button
              onClick={() => onCorrect(note, predAsAlt)}
              className="flex items-center justify-between rounded-lg px-3 py-2 w-full transition-all"
              style={{
                background: user_correction ? "rgba(255,255,255,0.03)" : "rgba(245,158,11,0.12)",
                border: `1px solid ${user_correction ? "rgba(255,255,255,0.08)" : "rgba(245,158,11,0.32)"}`,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(245,158,11,0.18)";
                e.currentTarget.style.borderColor = "rgba(245,158,11,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = user_correction ? "rgba(255,255,255,0.03)" : "rgba(245,158,11,0.12)";
                e.currentTarget.style.borderColor = user_correction ? "rgba(255,255,255,0.08)" : "rgba(245,158,11,0.32)";
              }}
            >
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.85rem", fontWeight: 500, color: user_correction ? "rgba(255,255,255,0.55)" : "#f59e0b" }}>
                {fmtPitch(prediction.step, prediction.alter, prediction.octave)}
                <span style={{ marginLeft: 5, opacity: 0.65, fontSize: "0.75rem" }}>
                  {fmtTypeName(prediction.type)}
                </span>
              </span>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.75rem", color: user_correction ? "rgba(255,255,255,0.28)" : "rgba(245,158,11,0.8)" }}>
                {Math.round(prediction.probability * 100)}%
              </span>
            </button>
          </div>

          {/* Delete note */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
          <button
            onClick={() => { onDelete(note); onClose(); }}
            className="w-full rounded-lg py-2 transition-colors hover:brightness-110"
            style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.75rem", background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)" }}
          >
            ✕ Delete Note
          </button>

          {/* Alternatives */}
          {sortedAlts.length > 0 && (
            <>
              <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
              <div>
                <p style={sectionLabel}>Alternatives</p>
                <div className="flex flex-col gap-1.5">
                  {sortedAlts.map((alt, idx) => (
                    <button
                      key={idx}
                      onClick={() => onCorrect(note, alt)}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-left transition-all"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer", width: "100%" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(34,197,94,0.12)";
                        e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                      }}
                    >
                      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.82rem", color: "rgba(255,255,255,0.85)" }}>
                        {fmtPitch(alt.step, alt.alter, alt.octave)}
                        <span style={{ marginLeft: 5, opacity: 0.5, fontSize: "0.72rem" }}>{fmtTypeName(alt.type)}</span>
                      </span>
                      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.72rem", color: "rgba(255,255,255,0.42)" }}>
                        {Math.round(alt.probability * 100)}%
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
