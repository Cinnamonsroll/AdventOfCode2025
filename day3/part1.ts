import * as fs from "fs";

type Line = `${number}`;
const inputFile = "input.txt";

const fileContent = fs.readFileSync(inputFile, "utf-8");
const lines = fileContent.trim().split("\n") as Line[];

let joltageSum = 0;

for (const line of lines) {
  let arrayOfNumbers = line.split("").map(Number);
  let currentLargestJoltage = 0;
  for (let i = 0; i < arrayOfNumbers.length; i++) {
    const number = arrayOfNumbers.at(i)!;
    const mutatedArray = arrayOfNumbers.slice(i + 1);
    for (let j = 0; j < mutatedArray.length; j++) {
      const compareNumber = mutatedArray.at(j)!;
      if (!compareNumber) continue;
      const finalNumber = number * 10 + compareNumber;
      if (finalNumber > currentLargestJoltage) {
        currentLargestJoltage = finalNumber;
      }
    }
  }
  joltageSum += currentLargestJoltage;
}
console.log(joltageSum);
