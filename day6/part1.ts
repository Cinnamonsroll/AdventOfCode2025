import * as fs from "fs";

const inputFile = "input.txt";

const fileContent = fs.readFileSync(inputFile, "utf-8");
const lines: string[] = fileContent.split(/\r?\n/);

let grandTotal = 0;

function parseInput(lines: string[]): string[][] {
  const splitLines = lines.map(line => line.split(" "));
  const expanded = splitLines.map(parts =>
    parts.map(x => (x === "" ? [" "] : x.split("")))
  );
  const flattened = expanded.map(parts => parts.flat())

  const result: string[][] = [];
  const lastRow = flattened.at(-1)!;

  for (let col = 0; col < lastRow.length; col++) {
  const op = lastRow[col];

  if (op !== " ") {
    result.push(flattened.map(row => row[col]!));
  } else {
    const column = flattened.map(row => row[col]!);
    const idx = result.length - 1;
    result[idx] = result[idx]!.map((a, i) => a + column[i]!)
  }
}

  return result;
}
function transformProblem(problem: string[]): string[] {
  return problem.map(x => x.trim());
}

const problems = parseInput(lines).map(transformProblem)

for (let problem of problems) {
  if (!problem) continue;

  const operator = problem.at(-1) as "*" | "+";
  const nums = problem.slice(0, -1).map(Number);
  const result = nums.reduce(
    (acc, curr) => (operator === "*" ? acc * curr : acc + curr),
    operator === "*" ? 1 : 0
  );

  grandTotal += result;
}

console.log(grandTotal);
