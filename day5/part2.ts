import * as fs from "fs";

type Range = { lower: number; upper: number };

const inputFile = "input.txt";
const fileContent = fs.readFileSync(inputFile, "utf-8");

const parts = fileContent.split(/\r?\n\r?\n/g);
const rangesRaw = parts[0] ?? "";

const rangeLines = rangesRaw.split(/\r?\n/).filter(Boolean);

const parsedRanges: Range[] = [];

for (const line of rangeLines) {
  const [l, u] = line.split("-");
  if (l !== undefined && u !== undefined) {
    parsedRanges.push({ lower: Number(l), upper: Number(u) });
  }
}

parsedRanges.sort((a, b) => a.lower - b.lower);

const merged: Range[] = [];
for (const range of parsedRanges) {
  if (merged.length === 0) {
    merged.push({ ...range });
    continue;
  }

  const last = merged.at(-1)!;

  if (range.lower <= last.upper + 1) {
    last.upper = Math.max(last.upper, range.upper);
  } else {
    merged.push({ ...range });
  }
}

let freshIngredients = 0;

for (const { lower, upper } of merged) {
  freshIngredients += upper - lower + 1;
}

console.log(freshIngredients);
