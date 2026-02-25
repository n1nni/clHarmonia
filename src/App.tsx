// TODO: Replace omrData import with a fetch() call to your OMR API endpoint
import { useState, useCallback, useRef, useMemo } from "react";
import { omrData } from "./data/mockOmrResponse";
import type { Note, NoteAlternative, NoteStep, AlterValue, NoteType } from "./types/omr";
import { ScoreViewer } from "./components/ScoreViewer";
import { ThresholdSlider } from "./components/ThresholdSlider";
import { Legend } from "./components/Legend";
import { AddNoteForm } from "./components/AddNoteForm";

const DEFAULT_THRESHOLD = 65;

const DURATION_DIVISIONS: Record<NoteType, number> = {
  whole: 16, half: 8, quarter: 4, eighth: 2, "16th": 1, "32nd": 1,
};

function flattenNotes(data: typeof omrData): Note[] {
  return data.systems.flatMap((sys) => sys.measures.flatMap((m) => m.notes));
}

interface AddNotePos {
  origX: number;
  origY: number;
  clientX: number;
  clientY: number;
}

export default function App() {
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);
  const [imageUrl, setImageUrl]   = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [addNoteMode, setAddNoteMode] = useState(false);
  const [addNotePos, setAddNotePos]   = useState<AddNotePos | null>(null);
  const [addedNoteIds, setAddedNoteIds] = useState<string[]>([]);
  const addedNoteCounter = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Notes keyed by ID for O(1) updates
  const [notesById, setNotesById] = useState<Map<string, Note>>(() => {
    const initial = flattenNotes(omrData);
    return new Map(initial.map((n) => [n.id, n]));
  });

  // Stable ordered IDs from the original OMR data
  const originalNoteIds = useMemo(
    () => omrData.systems.flatMap((sys) => sys.measures.flatMap((m) => m.notes.map((n) => n.id))),
    []
  );

  // Combine original + user-added IDs, then resolve to Note objects
  const notes: Note[] = useMemo(() => {
    const allIds = [...originalNoteIds, ...addedNoteIds];
    return allIds.map((id) => notesById.get(id)).filter((n): n is Note => n !== undefined);
  }, [originalNoteIds, addedNoteIds, notesById]);

  // Legend counts
  const { uncertainCount, acceptedCount, correctedCount } = useMemo(() => {
    let uncertain = 0, accepted = 0, corrected = 0;
    for (const note of notes) {
      if (note.user_correction !== null) corrected++;
      else if (note.prediction.probability < threshold / 100) uncertain++;
      else accepted++;
    }
    return { uncertainCount: uncertain, acceptedCount: accepted, correctedCount: corrected };
  }, [notes, threshold]);

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleCorrect = useCallback((noteId: string, alternative: NoteAlternative) => {
    setNotesById((prev) => {
      const note = prev.get(noteId);
      if (!note) return prev;
      return new Map(prev).set(noteId, {
        ...note,
        user_correction: {
          step: alternative.step,
          octave: alternative.octave,
          alter: alternative.alter,
          duration_divisions: alternative.duration_divisions,
          type: alternative.type,
          corrected_at: new Date().toISOString(),
        },
      });
    });
  }, []);

  const handleReset = useCallback((noteId: string) => {
    setNotesById((prev) => {
      const note = prev.get(noteId);
      if (!note) return prev;
      return new Map(prev).set(noteId, { ...note, user_correction: null });
    });
  }, []);

  const handleScoreClick = useCallback((origX: number, origY: number, clientX: number, clientY: number) => {
    setAddNotePos({ origX, origY, clientX, clientY });
  }, []);

  const handleAddNoteSubmit = useCallback((step: NoteStep, octave: number, alter: AlterValue, type: NoteType) => {
    if (!addNotePos) return;
    const id = `user_n_${++addedNoteCounter.current}`;
    const { origX, origY } = addNotePos;
    const newNote: Note = {
      id,
      staff_number: 1,
      voice: 1,
      location: {
        bbox: { x: origX - 8, y: origY - 6, width: 16, height: 11 },
        stem_bbox: null,
        page: 1,
      },
      prediction: {
        step, octave, alter,
        duration_divisions: DURATION_DIVISIONS[type],
        type,
        probability: 1.0,
      },
      alternatives: [],
      render: {
        stem_direction: "none",
        beam_group: null,
        beam_position: null,
        dots: 0,
        tie: null,
        accidental: alter === 1 ? "sharp" : alter === -1 ? "flat" : null,
        staff_position: 0,
      },
      user_correction: {
        step, octave, alter,
        duration_divisions: DURATION_DIVISIONS[type],
        type,
        corrected_at: new Date().toISOString(),
      },
    };
    setNotesById((prev) => new Map(prev).set(id, newNote));
    setAddedNoteIds((prev) => [...prev, id]);
    setAddNotePos(null);
    setAddNoteMode(false);
  }, [addNotePos]);

  const handleExport = useCallback(() => {
    // Build full OMR output with all corrections applied
    const correctedSystems = omrData.systems.map((sys) => ({
      ...sys,
      measures: sys.measures.map((m) => ({
        ...m,
        notes: m.notes.map((n) => notesById.get(n.id) ?? n),
      })),
    }));

    const addedNoteList = addedNoteIds
      .map((id) => notesById.get(id))
      .filter((n): n is Note => n !== undefined);

    const exportData = {
      ...omrData,
      systems: correctedSystems,
      added_notes: addedNoteList,
      exported_at: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `omr_corrected_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [notesById, addedNoteIds]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setImageUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return url; });
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver  = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);
  const triggerFileInput = () => fileInputRef.current?.click();

  const toggleAddNoteMode = () => {
    setAddNoteMode((prev) => !prev);
    setAddNotePos(null);
  };

  // ── Styles ───────────────────────────────────────────────────────────────

  const headerBtnBase: React.CSSProperties = {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: "0.72rem",
    borderRadius: 7,
    padding: "5px 12px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 150ms ease",
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0f1117", color: "#e5e7eb" }}>

      {/* ── Sticky Control Bar ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 flex flex-col gap-3 px-5 py-3"
        style={{ background: "#1a1d27", borderBottom: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 2px 16px rgba(0,0,0,0.5)" }}>

        {/* Row 1: title + upload + action buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 700, fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)", color: "#f59e0b", letterSpacing: "0.02em", lineHeight: 1, marginRight: 4 }}>
            Harmonia OMR
          </h1>

          {/* Upload */}
          <div
            role="button" tabIndex={0}
            onClick={triggerFileInput}
            onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
            onKeyDown={(e) => e.key === "Enter" && triggerFileInput()}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 cursor-pointer transition-all"
            style={{ border: `1.5px dashed ${isDragging ? "#f59e0b" : "rgba(255,255,255,0.18)"}`, background: isDragging ? "rgba(245,158,11,0.08)" : "rgba(255,255,255,0.03)" }}
            aria-label="Upload score image"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ color: isDragging ? "#f59e0b" : "rgba(255,255,255,0.4)", flexShrink: 0 }}>
              <path d="M8 1v9M4.5 4.5L8 1l3.5 3.5M2 11.5v1A1.5 1.5 0 003.5 14h9a1.5 1.5 0 001.5-1.5v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.72rem", color: isDragging ? "#f59e0b" : "rgba(255,255,255,0.45)", whiteSpace: "nowrap" }}>
              {imageUrl ? "Replace image" : "Upload image"}
            </span>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleInputChange} aria-hidden="true" />
          </div>

          {/* Add Note toggle */}
          <button
            onClick={toggleAddNoteMode}
            style={{
              ...headerBtnBase,
              background: addNoteMode ? "#22c55e" : "rgba(34,197,94,0.1)",
              color: addNoteMode ? "#0f1117" : "#22c55e",
              border: `1px solid ${addNoteMode ? "#22c55e" : "rgba(34,197,94,0.3)"}`,
              fontWeight: addNoteMode ? 500 : 400,
            }}
            title={addNoteMode ? "Cancel add-note mode" : "Click to enable add-note mode, then click on the score"}
          >
            {addNoteMode ? "✕ Cancel Add" : "+ Add Note"}
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExport}
            style={{
              ...headerBtnBase,
              background: "rgba(59,130,246,0.1)",
              color: "#3b82f6",
              border: "1px solid rgba(59,130,246,0.3)",
            }}
            title="Download corrected OMR data as JSON"
          >
            ↓ Export JSON
          </button>
        </div>

        {/* Row 2: threshold + legend */}
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <ThresholdSlider value={threshold} onChange={setThreshold} />
          <Legend uncertainCount={uncertainCount} acceptedCount={acceptedCount} correctedCount={correctedCount} />
        </div>
      </header>

      {/* ── Score Area ───────────────────────────────────────────────────── */}
      <main className="flex-1 px-4 py-5 md:px-8">
        <div className="mx-auto rounded-xl" style={{ maxWidth: 1280, background: "#1a1d27", boxShadow: "0 4px 32px rgba(0,0,0,0.6)", padding: 16 }}>

          {/* Meta bar */}
          <div className="flex items-center justify-between mb-3 px-1" style={{ opacity: 0.45 }}>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em" }}>
              {omrData.image_id} · OMR v{omrData.omr_version} · {omrData.image_size.width}×{omrData.image_size.height}
            </span>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.65rem", color: "rgba(255,255,255,0.6)" }}>
              {notes.length} notes · {omrData.systems.length} systems
            </span>
          </div>

          <ScoreViewer
            omrData={omrData}
            threshold={threshold}
            imageUrl={imageUrl}
            notes={notes}
            addNoteMode={addNoteMode}
            onCorrect={handleCorrect}
            onReset={handleReset}
            onAddClick={handleScoreClick}
          />
        </div>

        <p className="text-center mt-5" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.65rem", color: "rgba(255,255,255,0.18)" }}>
          Click any note box to correct it · Press Esc to close popup · Use "+ Add Note" to mark missed notes
        </p>
      </main>

      {/* ── Add Note Form (portal-like fixed positioning) ─────────────── */}
      {addNotePos && (
        <AddNoteForm
          anchorX={addNotePos.clientX}
          anchorY={addNotePos.clientY}
          onSubmit={handleAddNoteSubmit}
          onClose={() => { setAddNotePos(null); setAddNoteMode(false); }}
        />
      )}
    </div>
  );
}
