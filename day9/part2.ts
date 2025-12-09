import * as fs from "fs";

const inputLines = fs.readFileSync("input.txt", "utf8").trim().split(/\r?\n/);
const n = inputLines.length;
const poly: [number, number][] = inputLines.map((line) => {
  const [x, y] = line.split(",").map(Number);
  return [x, y];
});

let maxArea = 0;

for (let i = 0; i < n; i++) {
  const [ax, ay] = poly[i]!;
  for (let j = i + 1; j < n; j++) {
    const [bx, by] = poly[j]!;
    const x1 = Math.min(ax, bx),
      x2 = Math.max(ax, bx);
    const y1 = Math.min(ay, by),
      y2 = Math.max(ay, by);
    const area = (x2 - x1 + 1) * (y2 - y1 + 1);

    if (area <= maxArea) continue;

    let valid = true;

    for (let k = 0; k < 4 && valid; k++) {
      const cx = k & 1 ? x2 : x1,
        cy = k & 2 ? y2 : y1;
      let inside = false;

      for (let m = 0; m < n; m++) {
        const [x1p, y1p] = poly[m],
          [x2p, y2p] = poly[(m + 1) % n];
        const cross = (x2p - x1p) * (cy - y1p) - (y2p - y1p) * (cx - x1p);

        if (
          cross === 0 &&
          cx >= Math.min(x1p, x2p) &&
          cx <= Math.max(x1p, x2p) &&
          cy >= Math.min(y1p, y2p) &&
          cy <= Math.max(y1p, y2p)
        ) {
          inside = true;
          break;
        }

        if (y1p > cy !== y2p > cy) {
          const xInt = ((x2p - x1p) * (cy - y1p)) / (y2p - y1p) + x1p;
          if (cx < xInt) inside = !inside;
        }
      }

      if (!inside) valid = false;
    }

    if (!valid) continue;

    const rEdges: [[number, number, number, number]][] = [
      [[x1, y1, x2, y1]],
      [[x2, y1, x2, y2]],
      [[x2, y2, x1, y2]],
      [[x1, y2, x1, y1]],
    ];

    for (let e = 0; e < 4 && valid; e++) {
      const [rx1, ry1, rx2, ry2] = rEdges[e]![0];

      for (let m = 0; m < n && valid; m++) {
        const [px1, py1] = poly[m],
          [px2, py2] = poly[(m + 1) % n];

        const v1 = (rx2 - rx1) * (py1 - ry1) - (ry2 - ry1) * (px1 - rx1);
        const v2 = (rx2 - rx1) * (py2 - ry1) - (ry2 - ry1) * (px2 - rx1);
        const v3 = (px2 - px1) * (ry1 - py1) - (py2 - py1) * (rx1 - px1);
        const v4 = (px2 - px1) * (ry2 - py1) - (py2 - py1) * (rx2 - px1);

        if (v1 * v2 < 0 && v3 * v4 < 0) valid = false;
      }
    }

    if (valid) maxArea = area;
  }
}

console.log(maxArea);
