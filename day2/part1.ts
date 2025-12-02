import * as fs from "fs";

const inputFile = "input.txt";

const fileContent = fs.readFileSync(inputFile, "utf-8");
const lines = fileContent.trim().split(",");

let totalWrongIds = 0;
for (const line of lines) {
  const [lowerRange, upperRange] = line.split("-").map(Number);
  if (lowerRange && upperRange) {
    const range = Array.from(
      { length: upperRange - lowerRange + 1 },
      (_, i) => i + lowerRange
    ).map(String);

    for (const id of range) {
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
}

console.log(totalWrongIds);
