import * as fs from "fs";

type Line = `${"L" | "R"}${number}`;

const inputFile = "input.txt";

const fileContent = fs.readFileSync(inputFile, "utf-8");
const lines = fileContent.trim().split("\n") as Line[];

let dial = 50;

let password = 0;

for (const line of lines) {
  const direction = line[0];
  const value = parseInt(line.slice(1));
  const sign = direction === "L" ? -1 : 1;
  for (let i = 0; i < value; i++) {
    dial = (dial + sign + 100) % 100;
    if (dial === 0) password++;
  }
}

console.log(password);
