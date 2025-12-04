import * as fs from "fs";

const inputFile = "input.txt";

const fileContent = fs.readFileSync(inputFile, "utf-8");
const lines: string[] = fileContent.split(/\r?\n/);

let removedRollsOfPaper = 0;
let totalAccessibleRolls = -1;
const removableRollsIndices: { r: number; c: number }[] = [];

function countAccessible(line: string, row: number, col: number): number {
  const currentLine = line;
  if (!currentLine) return 0;
  let accessibleRolls = 0;
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
      accessibleRolls++;
    }
  }
  return accessibleRolls;
}

while (totalAccessibleRolls) {
  totalAccessibleRolls = 0;
  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    if (currentLine) {
      for (let j = 0; j < currentLine.length; j++) {
        if (currentLine[j] === "@") {
          const adjacentRolls = countAccessible(currentLine, i, j);
          if (adjacentRolls < 4) {
            totalAccessibleRolls++;
            removableRollsIndices.push({ r: i, c: j });
          }
        }
      }
    }
  }
  removedRollsOfPaper += totalAccessibleRolls;
  for (const { r, c } of removableRollsIndices) {
    const chars = lines[r]?.split("");
    if (chars) {
      chars[c] = ".";
      lines[r] = chars.join("");
    }
  }
}

console.log(removedRollsOfPaper);
