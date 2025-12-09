import * as fs from "fs";

type Point = { x: number; y: number };

const inputFile = "input.txt";
const lines: string[] = fs.readFileSync(inputFile, "utf-8").split(/\r\n/);

const redTiles: Point[] = [];

for (const line of lines) {
  const [x, y] = line.split(",").map(Number);
  if (!x || !y) continue;
  redTiles.push({ x, y });
}

let largestArea = 0;

for (let i = 0; i < redTiles.length; i++) {
  for (let j = i + 1; j < redTiles.length; j++) {
    const p1 = redTiles[i]!;
    const p2 = redTiles[j]!;

    const width = Math.abs(p2.x - p1.x) + 1;
    const height = Math.abs(p2.y - p1.y) + 1;
    const area = width * height;

    if (area > largestArea) largestArea = area;
  }
}

console.log(largestArea);
