import * as fs from "fs";

type Point = { x: number; y: number; z: number };
type Edge = { distance: number; a: number; b: number };

const inputFile = "input.txt";

const points: Point[] = fs
  .readFileSync(inputFile, "utf-8")
  .trim()
  .split(/\r?\n/)
  .map((line) => {
    const parts = line.split(",").map(Number);
    return { x: parts[0]!, y: parts[1]!, z: parts[2]! };
  });

const dist = (p1: Point, p2: Point) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

const edges: Edge[] = [];
for (let a = 0; a < points.length; a++) {
  const p1 = points[a];
  if (!p1) continue;
  for (let b = 0; b < a; b++) {
    const p2 = points[b];
    if (!p2) continue;
    edges.push({
      distance: dist(p1, p2),
      a,
      b,
    });
  }
}

edges.sort((p, q) => p.distance - q.distance);

const N = points.length;
const parent = Array.from({ length: N }, (_, i) => i);
const rank = Array(N).fill(0);

function find(x: number): number {
  while (parent[x] !== x) {
    parent[x] = parent[parent[x]!]!;
    x = parent[x]!;
  }
  return x;
}

function unite(a: number, b: number) {
  const ra = find(a);
  const rb = find(b);
  if (ra === rb) return;

  if (rank[ra]! < rank[rb]!) parent[ra] = rb;
  else if (rank[rb]! < rank[ra]!) parent[rb] = ra;
  else {
    parent[rb] = ra;
    rank[ra]!++;
  }
}

for (let t = 0; t <= 1000; t++) {
  const { a, b } = edges[t] as Edge;
  unite(a, b);

  if (t === 1000) {
    const componentSize = new Map<number, number>();
    for (let v = 0; v < N; v++) {
      const root = find(v);
      componentSize.set(root, (componentSize.get(root) ?? 0) + 1);
    }

    const sizes = Array.from(componentSize.values()).sort((a, b) => a - b);
    const result = sizes.at(-1)! * sizes.at(-2)! * sizes.at(-3)!;

    console.log(result);
  }
}