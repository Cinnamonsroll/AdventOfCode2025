import * as fs from "fs";

const lines = fs.readFileSync("input.txt", "utf-8").trim().split(/\r?\n/);

const net: Record<string, string[]> = {};
for (const row of lines) {
  const [a, b] = row.split(": ");
  if (!a || !b) continue;
  net[a] = b.split(" ");
}

const memo: Record<string, number> = {};

const walk = (d: string): number => {
  if (d === "out") return 1;
  if (memo[d] !== undefined) return memo[d];
  let t = 0;
  const ns = net[d];
  if (ns) for (const nxt of ns) t += walk(nxt);
  return (memo[d] = t);
};

console.log(walk("you"));
