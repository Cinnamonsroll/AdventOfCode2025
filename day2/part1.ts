import * as fs from "fs";

type Line = `${number}-${number}`;

const inputFile = "input.txt";

const fileContent = fs.readFileSync(inputFile, "utf-8");
const lines = fileContent.trim().split(",") as Line[];

let totalWrongIds = 0;
for (const line of lines) {
  const [lowerRange, upperRange] = line.split("-").map(Number) as [
    number,
    number
  ];
  for (let i = 0; i <= upperRange - lowerRange; i++) {
    const id = String(lowerRange + i);
    if (id.length % 2 === 0) {
      const mid = id.length / 2;
      const left = id.slice(0, mid);
      const right = id.slice(mid);
      if (left === right) {
        totalWrongIds += parseInt(id);
        continue;
      }
    }
  }
}

console.log(totalWrongIds);
