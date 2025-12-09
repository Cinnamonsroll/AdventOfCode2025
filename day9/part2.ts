import * as fs from "fs";

interface Edge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

type Tile = [number, number];

const input = fs.readFileSync("input.txt", "utf8").trim().split(/\r?\n/);

let maxArea = 0;

const redTiles: Tile[] = [];
const edges: Edge[] = [];

const [initX, initY] = input[0]!.split(",").map(Number) as [number, number];
const [lastX, lastY] = input.at(-1)!.split(",").map(Number) as [number, number];

for (let i = 0; i < input.length - 1; i++) {
  const [fX, fY] = input[i]!.split(",").map(Number);
  const [tX, tY] = input[i + 1]!.split(",").map(Number);
  if(!fX || !fY || !tX || !tY) continue;

  edges.push({ x1: fX, y1: fY, x2: tX, y2: tY });
  redTiles.push([fX, fY], [tX, tY]);
}


edges.push({ x1: initX, y1: initY, x2: lastX, y2: lastY });

function intersects(minX: number, minY: number, maxX: number, maxY: number): boolean {
  for (const e of edges) {
    const iMinX = Math.min(e.x1, e.x2);
    const iMaxX = Math.max(e.x1, e.x2);
    const iMinY = Math.min(e.y1, e.y2);
    const iMaxY = Math.max(e.y1, e.y2);
    if (minX < iMaxX && maxX > iMinX && minY < iMaxY && maxY > iMinY) return true;
  }
  return false;
}

function manhattan(a: Tile, b: Tile): number {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function rectangleArea(x1: number, y1: number, x2: number, y2: number): number {
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  return (maxX - minX + 1) * (maxY - minY + 1);
}

for (let i = 0; i < redTiles.length - 1; i++) {
  const a = redTiles[i]!;
  for (let j = i; j < redTiles.length; j++) {
    const b = redTiles[j]!;

    const minX = Math.min(a[0], b[0]);
    const maxX = Math.max(a[0], b[0]);
    const minY = Math.min(a[1], b[1]);
    const maxY = Math.max(a[1], b[1]);

    const m = manhattan(a, b);
    if (m * m <= maxArea) continue;

    if (!intersects(minX, minY, maxX, maxY)) {
      const area = rectangleArea(a[0], a[1], b[0], b[1]);
      if (area > maxArea) maxArea = area;
    }
  }
}

console.log(maxArea);
