import * as fs from "fs";

type Line = `${number}`;
const inputFile = "input.txt";

const fileContent = fs.readFileSync(inputFile, "utf-8");
const lines = fileContent.trim().split("\n") as Line[];

let joltageSum = 0;

for (const line of lines) {
  const arrayOfNumbers = line.trim().split("").map(Number)
  let currentLargestJoltage = 0;
  let maxId = -1;
  const poweredBatteries = 12;
  for (let i = 0; i < poweredBatteries; i++) {
    maxId++;
    if (maxId >= arrayOfNumbers.length) break;
    let max = arrayOfNumbers.at(maxId)!;
    let upperBound = arrayOfNumbers.length - (poweredBatteries - i - 1);
    for (let j = maxId + 1; j < upperBound; j++) {
      if (arrayOfNumbers.at(j)! > max) {
        max = arrayOfNumbers.at(j)!;
        maxId = j;
      }
    }
    currentLargestJoltage = currentLargestJoltage * 10 + max;
  }
  joltageSum += currentLargestJoltage;
}

console.log(joltageSum);
