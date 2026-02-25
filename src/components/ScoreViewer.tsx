import { useRef, useState, useCallback } from "react";
import type { OmrOutput, Note, NoteAlternative, StaffLine } from "../types/omr";
import { useScaleFactors } from "../hooks/useScaleFactors";
import { NoteBox } from "./NoteBox";
import { NotePopup } from "./NotePopup";

interface ScoreViewerProps {
  omrData: OmrOutput;
  threshold: number;
  imageUrl: string | null;
  notes: Note[];
  addNoteMode: boolean;
  onCorrect: (noteId: string, alternative: NoteAlternative) => void;
  onReset: (noteId: string) => void;
  onAddClick: (origX: number, origY: number, clientX: number, clientY: number) => void;
}

interface PopupState {
  note: Note;
  anchorX: number;
  anchorY: number;
}

function StaffLineOverlay({ staffLines, scaleX, scaleY }: { staffLines: StaffLine[]; scaleX: number; scaleY: number }) {
  return (
    <>
      {staffLines.map((sl) =>
        sl.y_positions.map((yPos, lineIdx) => (
          <div
            key={`sl_${sl.staff_number}_${lineIdx}`}
            className="absolute pointer-events-none"
            style={{
              left: sl.x_start * scaleX,
              top: yPos * scaleY,
              width: (sl.x_end - sl.x_start) * scaleX,
              height: 1,
              background: "rgba(229,217,182,0.4)",
            }}
          />
        ))
      )}
    </>
  );
}

export function ScoreViewer({ omrData, threshold, imageUrl, notes, addNoteMode, onCorrect, onReset, onAddClick }: ScoreViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scaleX, scaleY } = useScaleFactors(containerRef, omrData.image_size.width, omrData.image_size.height);

  const [popup, setPopup] = useState<PopupState | null>(null);

  const handleNoteClick = useCallback((note: Note, anchorX: number, anchorY: number) => {
    if (addNoteMode) return;
    setPopup((prev) => prev?.note.id === note.id ? null : { note, anchorX, anchorY });
  }, [addNoteMode]);

  const handleCorrect = useCallback((note: Note, alternative: NoteAlternative) => {
    onCorrect(note.id, alternative);
    setPopup(null);
  }, [onCorrect]);

  const handleReset = useCallback((note: Note) => {
    onReset(note.id);
  }, [onReset]);

  const handleClose = useCallback(() => setPopup(null), []);

  // Close popup when switching to add-note mode
  const handleContainerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!addNoteMode) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const origX = (e.clientX - rect.left) / scaleX;
    const origY = (e.clientY - rect.top) / scaleY;
    onAddClick(origX, origY, e.clientX, e.clientY);
  }, [addNoteMode, scaleX, scaleY, onAddClick]);

  const allStaffLines = omrData.systems.flatMap((sys) => sys.staff_lines);
  const aspectRatio = `${omrData.image_size.width} / ${omrData.image_size.height}`;

  return (
    <>
      <div
        className="relative w-full rounded-lg"
        style={{
          aspectRatio,
          maxWidth: "100%",
          background: imageUrl ? undefined : "#1e2130",
          cursor: addNoteMode ? "crosshair" : "default",
          // overflow visible so floating note labels aren't clipped
          overflow: "visible",
        }}
        ref={containerRef}
        onClick={handleContainerClick}
      >
        {/* Background */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Music score"
            className="absolute inset-0 w-full h-full rounded-lg"
            style={{ objectFit: "fill" }}
            draggable={false}
          />
        ) : (
          <div
            className="absolute inset-0 rounded-lg"
            style={{ background: "linear-gradient(135deg, #d4cfc4 0%, #c8c2b5 100%)" }}
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 700,
                fontSize: "clamp(0.9rem, 2.5vw, 1.5rem)",
                color: "rgba(80,70,55,0.28)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                userSelect: "none",
              }}>
                Upload a score image to begin
              </p>
            </div>
          </div>
        )}

        {/* Staff lines — always visible */}
        <StaffLineOverlay staffLines={allStaffLines} scaleX={scaleX} scaleY={scaleY} />

        {/* Note bounding boxes — only shown after image upload */}
        {imageUrl && notes.map((note) => (
          <NoteBox
            key={note.id}
            note={note}
            threshold={threshold}
            scale={{ scaleX, scaleY }}
            isSelected={popup?.note.id === note.id}
            addNoteMode={addNoteMode}
            onClick={handleNoteClick}
          />
        ))}

        {/* Add-note mode overlay hint */}
        {addNoteMode && (
          <div className="absolute inset-x-0 top-3 flex justify-center pointer-events-none" style={{ zIndex: 25 }}>
            <div style={{ background: "rgba(34,197,94,0.92)", borderRadius: 6, padding: "4px 14px" }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.72rem", color: "#0f1117", fontWeight: 500 }}>
                Click anywhere to place a new note
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Correction popup */}
      {popup && !addNoteMode && (
        <NotePopup
          note={popup.note}
          anchorX={popup.anchorX}
          anchorY={popup.anchorY}
          onCorrect={handleCorrect}
          onReset={handleReset}
          onClose={handleClose}
        />
      )}
    </>
  );
}
