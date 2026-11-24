// The One-Line Exit — a one-line resignation letter.
// The program writes exactly one line to /output/entry.txt.
// The sealed scorer requires UTF-8 text of 1 to 140 characters,
// a single line, and not only white space.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: one line, a resignation letter someone could actually send.
// The joke lands on the punchline — the goldfish earned the promotion.
const ENTRY =
  "I quit — not because the job was hard, but because the office goldfish got promoted over me and honestly, it earned it.";

// The grader mounts /output; locally, fall back to ./output if needed.
const OUTPUT_DIR = "/output";
const FALLBACK_DIR = join(process.cwd(), "output");

function writeEntry(): string {
  // Guard the gate: one line, 1-140 chars, not only whitespace.
  if (!ENTRY || ENTRY.trim().length === 0) {
    throw new Error("entry must not be empty");
  }
  if (ENTRY.length > 140) {
    throw new Error(`entry is ${ENTRY.length} chars, over the 140-char gate`);
  }
  if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
    throw new Error("entry must be exactly one line");
  }

  // Create the output directory if missing; never remove the directory
  // itself, only write the file inside it.
  let dir = OUTPUT_DIR;
  try {
    mkdirSync(dir, { recursive: true });
  } catch {
    dir = FALLBACK_DIR;
    mkdirSync(dir, { recursive: true });
  }

  const target = join(dir, "entry.txt");
  // Write the line with no trailing newline, so the file's character
  // count is exactly the entry's length and the gate sees one line.
  writeFileSync(target, ENTRY, "utf8");

  // Read it back and re-check the gate on the file itself, not just the
  // in-memory string, so a bad write fails loudly instead of silently.
  const written = readFileSync(target, "utf8");
  if (written !== ENTRY) {
    throw new Error("entry.txt content does not match the entry");
  }
  if (written.length < 1 || written.length > 140) {
    throw new Error(`entry.txt is ${written.length} chars, outside 1-140`);
  }
  return target;
}

const target = writeEntry();
console.log(`Wrote ${ENTRY.length}-char entry to ${target}:`);
console.log(ENTRY);
