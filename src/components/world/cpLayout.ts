// Stylised, to-scale-ish layout of Connaught Place.
// Units are roughly 1 = 3 m. Real CP: Inner Circle blocks A–F,
// Outer Circle blocks G–N, Central Park in the middle, radial roads between.
// R1 will replace these numbers with radii and angles from OpenStreetMap.

export type BlockDef = {
  letter: string;
  ring: "inner" | "outer";
  start: number; // radians
  end: number; // radians
};

export const RADII = {
  park: 34,
  innerRoad: 40,
  innerBlock: { r0: 44, r1: 58 },
  middleRoad: 64,
  outerBlock: { r0: 70, r1: 84 },
  outerRoad: 92,
};

const TAU = Math.PI * 2;

function ring(letters: string[], ringName: BlockDef["ring"], gap: number, offset: number) {
  const slice = TAU / letters.length;
  return letters.map((letter, i) => ({
    letter,
    ring: ringName,
    start: offset + i * slice + gap / 2,
    end: offset + (i + 1) * slice - gap / 2,
  }));
}

export const BLOCKS: BlockDef[] = [
  ...ring(["A", "B", "C", "D", "E", "F"], "inner", 0.16, Math.PI / 2),
  ...ring(["G", "H", "I", "J", "K", "L", "M", "N"], "outer", 0.1, Math.PI / 2 - 0.2),
];

/** Angles of the radial roads, taken from the gaps between inner blocks. */
export const RADIAL_ANGLES = BLOCKS.filter((b) => b.ring === "inner").map((b) => b.start - 0.08);
