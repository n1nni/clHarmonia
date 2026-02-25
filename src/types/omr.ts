export interface OmrOutput {
  omr_version: "2.0";
  image_id: string;
  image_size: { width: number; height: number };
  systems: System[];
}

export interface System {
  system_number: number;
  bbox: Bbox;
  staff_lines: StaffLine[];
  clef: Clef[];
  key_signature: KeySignature;
  time_signature: TimeSignature;
  measures: Measure[];
}

export interface StaffLine {
  staff_number: number;
  y_positions: [number, number, number, number, number];
  x_start: number;
  x_end: number;
}

export interface Clef {
  type: "treble" | "bass" | "alto" | "tenor";
  staff_number: number;
  bbox: Bbox;
}

export interface KeySignature {
  fifths: number;
  mode: "major" | "minor";
  bbox: Bbox;
}

export interface TimeSignature {
  beats: number;
  beat_type: number;
  bbox: Bbox;
}

export interface Measure {
  measure_number: number;
  bbox: Bbox;
  x_start: number;
  x_end: number;
  notes: Note[];
  rests: Rest[];
}

export type NoteStep = "C" | "D" | "E" | "F" | "G" | "A" | "B";
export type NoteType = "whole" | "half" | "quarter" | "eighth" | "16th" | "32nd";
export type AlterValue = -1 | 0 | 1;

export interface NotePrediction {
  step: NoteStep;
  octave: number;
  alter: AlterValue;
  duration_divisions: number;
  type: NoteType;
  probability: number;
}

export interface NoteAlternative {
  step: NoteStep;
  octave: number;
  alter: AlterValue;
  duration_divisions: number;
  type: NoteType;
  probability: number;
}

export interface NoteRender {
  stem_direction: "up" | "down" | "none";
  beam_group: string | null;
  beam_position: "begin" | "continue" | "end" | null;
  dots: 0 | 1 | 2;
  tie: "start" | "stop" | null;
  accidental: "sharp" | "flat" | "natural" | null;
  staff_position: number;
}

export interface UserCorrection {
  step: NoteStep;
  octave: number;
  alter: AlterValue;
  duration_divisions: number;
  type: NoteType;
  corrected_at: string;
}

export interface Note {
  id: string;
  staff_number: number;
  voice: number;
  location: {
    bbox: Bbox;
    stem_bbox: Bbox | null;
    page: number;
  };
  prediction: NotePrediction;
  alternatives: NoteAlternative[];
  render: NoteRender;
  user_correction: UserCorrection | null;
}

export interface Rest {
  id: string;
  staff_number: number;
  voice: number;
  location: { bbox: Bbox; page: number };
  prediction: { type: NoteType; duration_divisions: number; probability: number };
}

export interface Bbox {
  x: number;
  y: number;
  width: number;
  height: number;
}
