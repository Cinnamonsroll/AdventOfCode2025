import * as fs from "fs";

const inputFile = "input.txt";

const fileContent = fs.readFileSync(inputFile, "utf-8");
const lines: string[] = fileContent.split(/\r?\n/);

let rollsOfPaper = 0;

function isAccessible(line: string, row: number, col: number): boolean {
  const currentLine = line;
  if (!currentLine) return false;
  let otherRolls = 0;
  const adjacentPositions: [number, number][] = [
    [row, col - 1],
    [row, col + 1],
    [row - 1, col],
    [row + 1, col],
    [row - 1, col - 1],
    [row - 1, col + 1],
    [row + 1, col - 1],
    [row + 1, col + 1],
  ];
  for (const [r, c] of adjacentPositions) {
    if (lines[r] && lines[r][c] === "@") {
      otherRolls++;
    }
  }
  return otherRolls < 4;
}

for (let i = 0; i < lines.length; i++) {
  const currentLine = lines[i];
  if (currentLine) {
    for (let j = 0; j < currentLine.length; j++) {
      if (currentLine[j] === "@" && isAccessible(currentLine, i, j)) {
        rollsOfPaper++;
      }
    }
  }
}

console.log(rollsOfPaper);
