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
    const doubled = id + id;
    const substring = doubled.slice(1, -1);
    if (substring.includes(id)) {
      totalWrongIds += parseInt(id);
      continue;
    }
  }
}

console.log(totalWrongIds);
