import * as fs from "fs";

const inputLines = fs.readFileSync("input.txt", "utf8").trim().split(/\r?\n/);

function parseInput(lines: string[]) {
  let i = 0,
    shapes: string[][] = [],
    regions: { width: number; height: number; required: number[] }[] = [];
  while (i < lines.length) {
    if (!/^\d+:/.test(lines[i]!)) break;
    i++;
    const s = [];
    while (
      i < lines.length &&
      lines[i] &&
      !/^\d+:/.test(lines[i]!) &&
      !/^\d+x\d+:/.test(lines[i]!)
    )
      s.push(lines[i++]);
    shapes.push(s);
    while (i < lines.length && !lines[i]) i++;
  }
  for (; i < lines.length; i++) {
    if (!lines[i]) continue;
    const m = lines[i]!.match(/^(\d+)x(\d+):\s*(.*)$/);
    if (m)
      regions.push({
        width: +m[1]!,
        height: +m[2]!,
        required: m[3]!.split(/\s+/).map(Number),
      });
  }
  return { shapes, regions };
}

function shapeCoords(s: string[]) {
  const out: [number, number][] = [];
  for (let y = 0; y < s.length; y++)
    for (let x = 0; x < s[y]!.length; x++)
      if (s[y]![x] === "#") out.push([x, y]);
  return out;
}

const { shapes, regions } = parseInput(inputLines);
const shapePts = shapes.map(shapeCoords);
const shapeAreas = shapePts.map((p) => p.length);

let answer = 0;
for (const region of regions) {
  const regionArea = region.width * region.height;
  const requiredArea = region.required.reduce(
    (sum, count, shapeIndex) => sum + count * shapeAreas[shapeIndex]!,
    0
  );
  if (regionArea > requiredArea) answer++;
}

console.log(answer);
