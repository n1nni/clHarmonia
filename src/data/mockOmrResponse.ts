import type { OmrOutput } from "../types/omr";

// TODO: Replace this with a real API call to your OMR backend.
// Expected endpoint: POST /omr/recognize
// Request: multipart/form-data with the uploaded image file
// Response: JSON matching the OmrOutput type above
export const omrData: OmrOutput = {
  omr_version: "2.0",
  image_id: "demo_score.png",
  image_size: { width: 1200, height: 820 },
  systems: [
    // ─── SYSTEM 1 (measures 1–3, top half of image) ───────────────────────
    {
      system_number: 1,
      bbox: { x: 50, y: 60, width: 1100, height: 200 },
      staff_lines: [
        { staff_number: 1, y_positions: [100, 114, 128, 142, 156], x_start: 110, x_end: 1140 },
      ],
      clef: [{ type: "treble", staff_number: 1, bbox: { x: 55, y: 88, width: 28, height: 70 } }],
      key_signature: { fifths: 0, mode: "major", bbox: { x: 86, y: 90, width: 8, height: 66 } },
      time_signature: { beats: 4, beat_type: 4, bbox: { x: 98, y: 96, width: 24, height: 60 } },
      measures: [
        // Measure 1
        {
          measure_number: 1,
          bbox: { x: 130, y: 75, width: 280, height: 170 },
          x_start: 130, x_end: 410,
          rests: [],
          notes: [
            {
              id: "n_01_01", staff_number: 1, voice: 1,
              location: { bbox: { x: 148, y: 135, width: 16, height: 11 }, stem_bbox: { x: 163, y: 86, width: 2, height: 49 }, page: 1 },
              prediction: { step: "C", octave: 4, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.96 },
              alternatives: [
                { step: "D", octave: 4, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.03 },
                { step: "B", octave: 3, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.01 },
              ],
              render: { stem_direction: "up", beam_group: null, beam_position: null, dots: 0, tie: null, accidental: null, staff_position: 0 },
              user_correction: null,
            },
            {
              id: "n_01_02", staff_number: 1, voice: 1,
              location: { bbox: { x: 218, y: 128, width: 16, height: 11 }, stem_bbox: { x: 233, y: 79, width: 2, height: 49 }, page: 1 },
              prediction: { step: "E", octave: 4, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.58 },
              alternatives: [
                { step: "F", octave: 4, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.27 },
                { step: "D", octave: 4, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.15 },
              ],
              render: { stem_direction: "up", beam_group: null, beam_position: null, dots: 0, tie: null, accidental: null, staff_position: 2 },
              user_correction: null,
            },
            {
              id: "n_01_03", staff_number: 1, voice: 1,
              location: { bbox: { x: 288, y: 121, width: 16, height: 11 }, stem_bbox: { x: 303, y: 72, width: 2, height: 49 }, page: 1 },
              prediction: { step: "G", octave: 4, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.91 },
              alternatives: [
                { step: "F", octave: 4, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.06 },
                { step: "A", octave: 4, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.03 },
              ],
              render: { stem_direction: "up", beam_group: null, beam_position: null, dots: 0, tie: null, accidental: null, staff_position: 4 },
              user_correction: null,
            },
            {
              id: "n_01_04", staff_number: 1, voice: 1,
              location: { bbox: { x: 358, y: 114, width: 16, height: 11 }, stem_bbox: { x: 373, y: 65, width: 2, height: 49 }, page: 1 },
              prediction: { step: "A", octave: 4, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.44 },
              alternatives: [
                { step: "G", octave: 4, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.36 },
                { step: "B", octave: 4, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.20 },
              ],
              render: { stem_direction: "up", beam_group: null, beam_position: null, dots: 0, tie: null, accidental: null, staff_position: 5 },
              user_correction: null,
            },
          ],
        },
        // Measure 2
        {
          measure_number: 2,
          bbox: { x: 410, y: 75, width: 300, height: 170 },
          x_start: 410, x_end: 710,
          rests: [],
          notes: [
            {
              id: "n_02_01", staff_number: 1, voice: 1,
              location: { bbox: { x: 428, y: 107, width: 16, height: 11 }, stem_bbox: { x: 443, y: 58, width: 2, height: 49 }, page: 1 },
              prediction: { step: "B", octave: 4, alter: 0, duration_divisions: 2, type: "eighth", probability: 0.83 },
              alternatives: [
                { step: "A", octave: 4, alter: 0, duration_divisions: 2, type: "eighth", probability: 0.11 },
                { step: "C", octave: 5, alter: 0, duration_divisions: 2, type: "eighth", probability: 0.06 },
              ],
              render: { stem_direction: "up", beam_group: "bm_02", beam_position: "begin", dots: 0, tie: null, accidental: null, staff_position: 6 },
              user_correction: null,
            },
            {
              id: "n_02_02", staff_number: 1, voice: 1,
              location: { bbox: { x: 488, y: 100, width: 16, height: 11 }, stem_bbox: { x: 503, y: 51, width: 2, height: 49 }, page: 1 },
              prediction: { step: "C", octave: 5, alter: 0, duration_divisions: 2, type: "eighth", probability: 0.94 },
              alternatives: [
                { step: "B", octave: 4, alter: 0, duration_divisions: 2, type: "eighth", probability: 0.04 },
                { step: "D", octave: 5, alter: 0, duration_divisions: 2, type: "eighth", probability: 0.02 },
              ],
              render: { stem_direction: "up", beam_group: "bm_02", beam_position: "end", dots: 0, tie: null, accidental: null, staff_position: 7 },
              user_correction: null,
            },
            {
              id: "n_02_03", staff_number: 1, voice: 1,
              location: { bbox: { x: 548, y: 114, width: 32, height: 11 }, stem_bbox: { x: 579, y: 65, width: 2, height: 49 }, page: 1 },
              prediction: { step: "G", octave: 4, alter: 0, duration_divisions: 12, type: "half", probability: 0.77 },
              alternatives: [
                { step: "A", octave: 4, alter: 0, duration_divisions: 12, type: "half", probability: 0.15 },
                { step: "F", octave: 4, alter: 0, duration_divisions: 12, type: "half", probability: 0.08 },
              ],
              render: { stem_direction: "up", beam_group: null, beam_position: null, dots: 1, tie: null, accidental: null, staff_position: 4 },
              user_correction: null,
            },
          ],
        },
        // Measure 3
        {
          measure_number: 3,
          bbox: { x: 710, y: 75, width: 300, height: 170 },
          x_start: 710, x_end: 1010,
          rests: [],
          notes: [
            {
              id: "n_03_01", staff_number: 1, voice: 1,
              location: { bbox: { x: 730, y: 121, width: 30, height: 11 }, stem_bbox: null, page: 1 },
              prediction: { step: "F", octave: 4, alter: 1, duration_divisions: 16, type: "whole", probability: 0.89 },
              alternatives: [
                { step: "F", octave: 4, alter: 0, duration_divisions: 16, type: "whole", probability: 0.07 },
                { step: "G", octave: 4, alter: 0, duration_divisions: 16, type: "whole", probability: 0.04 },
              ],
              render: { stem_direction: "none", beam_group: null, beam_position: null, dots: 0, tie: null, accidental: "sharp", staff_position: 3 },
              user_correction: null,
            },
            {
              id: "n_03_02", staff_number: 1, voice: 1,
              location: { bbox: { x: 820, y: 128, width: 16, height: 11 }, stem_bbox: { x: 835, y: 79, width: 2, height: 49 }, page: 1 },
              prediction: { step: "F", octave: 4, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.42 },
              alternatives: [
                { step: "E", octave: 4, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.35 },
                { step: "D", octave: 4, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.23 },
              ],
              render: { stem_direction: "up", beam_group: null, beam_position: null, dots: 0, tie: null, accidental: null, staff_position: 3 },
              user_correction: null,
            },
            {
              id: "n_03_03", staff_number: 1, voice: 1,
              location: { bbox: { x: 896, y: 114, width: 16, height: 11 }, stem_bbox: { x: 911, y: 65, width: 2, height: 49 }, page: 1 },
              prediction: { step: "A", octave: 4, alter: -1, duration_divisions: 4, type: "quarter", probability: 0.47 },
              alternatives: [
                { step: "G", octave: 4, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.31 },
                { step: "A", octave: 4, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.22 },
              ],
              render: { stem_direction: "up", beam_group: null, beam_position: null, dots: 0, tie: null, accidental: "flat", staff_position: 5 },
              user_correction: null,
            },
            {
              id: "n_03_04", staff_number: 1, voice: 1,
              location: { bbox: { x: 962, y: 107, width: 16, height: 11 }, stem_bbox: { x: 977, y: 58, width: 2, height: 49 }, page: 1 },
              prediction: { step: "C", octave: 5, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.88 },
              alternatives: [
                { step: "B", octave: 4, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.09 },
                { step: "D", octave: 5, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.03 },
              ],
              render: { stem_direction: "up", beam_group: null, beam_position: null, dots: 0, tie: null, accidental: null, staff_position: 7 },
              user_correction: null,
            },
          ],
        },
      ],
    },

    // ─── SYSTEM 2 (measures 4–5, lower half of image) ──────────────────────
    {
      system_number: 2,
      bbox: { x: 50, y: 480, width: 1100, height: 200 },
      staff_lines: [
        { staff_number: 1, y_positions: [520, 534, 548, 562, 576], x_start: 110, x_end: 1140 },
      ],
      clef: [{ type: "treble", staff_number: 1, bbox: { x: 55, y: 508, width: 28, height: 70 } }],
      key_signature: { fifths: 0, mode: "major", bbox: { x: 86, y: 510, width: 8, height: 66 } },
      time_signature: { beats: 4, beat_type: 4, bbox: { x: 98, y: 516, width: 24, height: 60 } },
      measures: [
        // Measure 4
        {
          measure_number: 4,
          bbox: { x: 130, y: 495, width: 490, height: 170 },
          x_start: 130, x_end: 620,
          rests: [],
          notes: [
            {
              id: "n_04_01", staff_number: 1, voice: 1,
              location: { bbox: { x: 150, y: 548, width: 16, height: 11 }, stem_bbox: { x: 165, y: 499, width: 2, height: 49 }, page: 1 },
              prediction: { step: "D", octave: 5, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.72 },
              alternatives: [
                { step: "E", octave: 5, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.19 },
                { step: "C", octave: 5, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.09 },
              ],
              render: { stem_direction: "down", beam_group: null, beam_position: null, dots: 0, tie: null, accidental: null, staff_position: 8 },
              user_correction: null,
            },
            {
              id: "n_04_02", staff_number: 1, voice: 1,
              location: { bbox: { x: 218, y: 541, width: 16, height: 11 }, stem_bbox: { x: 233, y: 492, width: 2, height: 49 }, page: 1 },
              prediction: { step: "E", octave: 5, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.38 },
              alternatives: [
                { step: "F", octave: 5, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.37 },
                { step: "D", octave: 5, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.25 },
              ],
              render: { stem_direction: "down", beam_group: null, beam_position: null, dots: 0, tie: null, accidental: null, staff_position: 9 },
              user_correction: null,
            },
            {
              id: "n_04_03", staff_number: 1, voice: 1,
              location: { bbox: { x: 286, y: 534, width: 16, height: 11 }, stem_bbox: { x: 301, y: 485, width: 2, height: 49 }, page: 1 },
              prediction: { step: "G", octave: 5, alter: 0, duration_divisions: 2, type: "eighth", probability: 0.61 },
              alternatives: [
                { step: "F", octave: 5, alter: 0, duration_divisions: 2, type: "eighth", probability: 0.24 },
                { step: "A", octave: 5, alter: 0, duration_divisions: 2, type: "eighth", probability: 0.15 },
              ],
              render: { stem_direction: "down", beam_group: "bm_04a", beam_position: "begin", dots: 0, tie: null, accidental: null, staff_position: 11 },
              user_correction: null,
            },
            {
              id: "n_04_04", staff_number: 1, voice: 1,
              location: { bbox: { x: 346, y: 527, width: 16, height: 11 }, stem_bbox: { x: 361, y: 478, width: 2, height: 49 }, page: 1 },
              prediction: { step: "A", octave: 5, alter: 0, duration_divisions: 2, type: "eighth", probability: 0.29 },
              alternatives: [
                { step: "G", octave: 5, alter: 0, duration_divisions: 2, type: "eighth", probability: 0.41 },
                { step: "B", octave: 5, alter: 0, duration_divisions: 2, type: "eighth", probability: 0.30 },
              ],
              render: { stem_direction: "down", beam_group: "bm_04a", beam_position: "end", dots: 0, tie: null, accidental: null, staff_position: 12 },
              user_correction: null,
            },
            {
              id: "n_04_05", staff_number: 1, voice: 1,
              location: { bbox: { x: 420, y: 548, width: 32, height: 11 }, stem_bbox: null, page: 1 },
              prediction: { step: "C", octave: 5, alter: 0, duration_divisions: 16, type: "whole", probability: 0.97 },
              alternatives: [
                { step: "D", octave: 5, alter: 0, duration_divisions: 16, type: "whole", probability: 0.02 },
                { step: "B", octave: 4, alter: 0, duration_divisions: 16, type: "whole", probability: 0.01 },
              ],
              render: { stem_direction: "none", beam_group: null, beam_position: null, dots: 0, tie: null, accidental: null, staff_position: 7 },
              user_correction: null,
            },
          ],
        },
        // Measure 5
        {
          measure_number: 5,
          bbox: { x: 620, y: 495, width: 490, height: 170 },
          x_start: 620, x_end: 1110,
          rests: [],
          notes: [
            {
              id: "n_05_01", staff_number: 1, voice: 1,
              location: { bbox: { x: 640, y: 555, width: 16, height: 11 }, stem_bbox: { x: 655, y: 506, width: 2, height: 49 }, page: 1 },
              prediction: { step: "B", octave: 4, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.52 },
              alternatives: [
                { step: "C", octave: 5, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.29 },
                { step: "A", octave: 4, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.19 },
              ],
              render: { stem_direction: "up", beam_group: null, beam_position: null, dots: 0, tie: null, accidental: null, staff_position: 6 },
              user_correction: null,
            },
            {
              id: "n_05_02", staff_number: 1, voice: 1,
              location: { bbox: { x: 710, y: 562, width: 16, height: 11 }, stem_bbox: { x: 725, y: 513, width: 2, height: 49 }, page: 1 },
              prediction: { step: "A", octave: 4, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.85 },
              alternatives: [
                { step: "B", octave: 4, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.10 },
                { step: "G", octave: 4, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.05 },
              ],
              render: { stem_direction: "up", beam_group: null, beam_position: null, dots: 0, tie: null, accidental: null, staff_position: 5 },
              user_correction: null,
            },
            {
              id: "n_05_03", staff_number: 1, voice: 1,
              location: { bbox: { x: 780, y: 548, width: 16, height: 11 }, stem_bbox: { x: 795, y: 499, width: 2, height: 49 }, page: 1 },
              prediction: { step: "C", octave: 5, alter: 1, duration_divisions: 4, type: "quarter", probability: 0.36 },
              alternatives: [
                { step: "C", octave: 5, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.35 },
                { step: "D", octave: 5, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.29 },
              ],
              render: { stem_direction: "down", beam_group: null, beam_position: null, dots: 0, tie: null, accidental: "sharp", staff_position: 7 },
              user_correction: null,
            },
            {
              id: "n_05_04", staff_number: 1, voice: 1,
              location: { bbox: { x: 850, y: 534, width: 16, height: 11 }, stem_bbox: { x: 865, y: 485, width: 2, height: 49 }, page: 1 },
              prediction: { step: "E", octave: 5, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.90 },
              alternatives: [
                { step: "D", octave: 5, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.07 },
                { step: "F", octave: 5, alter: 0, duration_divisions: 4, type: "quarter", probability: 0.03 },
              ],
              render: { stem_direction: "down", beam_group: null, beam_position: null, dots: 0, tie: null, accidental: null, staff_position: 9 },
              user_correction: null,
            },
            {
              id: "n_05_05", staff_number: 1, voice: 1,
              location: { bbox: { x: 920, y: 541, width: 32, height: 11 }, stem_bbox: { x: 951, y: 492, width: 2, height: 64 }, page: 1 },
              prediction: { step: "D", octave: 5, alter: 0, duration_divisions: 8, type: "half", probability: 0.66 },
              alternatives: [
                { step: "C", octave: 5, alter: 0, duration_divisions: 8, type: "half", probability: 0.22 },
                { step: "E", octave: 5, alter: 0, duration_divisions: 8, type: "half", probability: 0.12 },
              ],
              render: { stem_direction: "down", beam_group: null, beam_position: null, dots: 0, tie: "start", accidental: null, staff_position: 8 },
              user_correction: null,
            },
            {
              id: "n_05_06", staff_number: 1, voice: 1,
              location: { bbox: { x: 1010, y: 541, width: 32, height: 11 }, stem_bbox: { x: 1041, y: 492, width: 2, height: 64 }, page: 1 },
              prediction: { step: "D", octave: 5, alter: 0, duration_divisions: 8, type: "half", probability: 0.93 },
              alternatives: [
                { step: "C", octave: 5, alter: 0, duration_divisions: 8, type: "half", probability: 0.05 },
                { step: "E", octave: 5, alter: 0, duration_divisions: 8, type: "half", probability: 0.02 },
              ],
              render: { stem_direction: "down", beam_group: null, beam_position: null, dots: 0, tie: "stop", accidental: null, staff_position: 8 },
              user_correction: null,
            },
          ],
        },
      ],
    },
  ],
};
