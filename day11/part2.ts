import * as fs from "fs";

const lines = fs.readFileSync("input.txt", "utf-8").trim().split(/\r?\n/);
const net: Record<string, string[]> = {};
for (const r of lines) {
  const [a, b] = r.split(": ");
  if (a && b) net[a] = b.split(" ");
}

const memo: Record<string, number> = {};

const walk = (d: string, f: boolean, c: boolean): number => {
  if (d === "out") return f && c ? 1 : 0;
  const k = d + "|" + (f ? 1 : 0) + "|" + (c ? 1 : 0);
  if (k in memo) return memo[k] as number;
  const nf = f || d === "fft";
  const nc = c || d === "dac";
  let t = 0;
  const ns = net[d];
  if (ns) for (const nxt of ns) t += walk(nxt, nf, nc);
  return (memo[k] = t);
};

console.log(walk("svr", false, false));
