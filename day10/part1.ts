import * as fs from "fs";

const inputFile = "input.txt";
const lines: string[] = fs
  .readFileSync(inputFile, "utf-8")
  .trim()
  .split(/\r?\n/);

type Machine = { target: number[]; buttons: number[][] };

const machines: Machine[] = lines.map((line) => {
  const diag = /\[(.*?)\]/.exec(line)![1]!;
  const target = diag.split("").map((c) => (c === "#" ? 1 : 0));
  const btns = [...line.matchAll(/\((.*?)\)/g)]
    .map((m) => m[1]!)
    .filter((s) => s.length > 0)
    .map((s) => s.split(",").map((n) => parseInt(n, 10)));
  return { target, buttons: btns };
});

function bitCount(x: number): number {
  let c = 0;
  while (x) {
    x &= x - 1;
    c++;
  }
  return c;
}

function solveMachine(m: Machine): number {
  const n = m.target.length;
  const mBtns = m.buttons.length;
  const cols: number[] = [];
  for (const btn of m.buttons) {
    let mask = 0;
    for (const i of btn) mask |= 1 << i;
    cols.push(mask);
  }
  let targetMask = 0;
  for (let i = 0; i < n; i++) {
    if (m.target[i]) targetMask |= 1 << i;
  }
  let best = Infinity;
  const limit = 1 << mBtns;
  for (let s = 0; s < limit; s++) {
    const bc = bitCount(s);
    if (bc >= best) continue;
    let mask = 0;
    for (let j = 0; j < mBtns; j++) {
      if ((s >> j) & 1) mask ^= cols[j]!;
    }
    if (mask === targetMask) best = bc;
  }
  return best;
}

let total = 0;
for (const m of machines) total += solveMachine(m);
console.log(total);
