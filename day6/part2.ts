import * as fs from "fs";

const inputFile = "input.txt";

const fileContent = fs.readFileSync(inputFile, "utf-8");
const lines = fileContent.split(/\r?\n/);

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
    result[idx] = result[idx]!.map((a, i) => a + column[i]!);
  }
}

  return result;
}

function transformProblem(problem: string[]): (string | number)[] {
  const numbers = problem.slice(0, -1);
  const operator = problem.at(-1)!;

  const output: (string | number)[] = []

  for (let i = operator.length - 1; i >= 0; i--) {
    let column = "";
    for (const num of numbers) {
      column += num[i] ?? " ";
    }
    output.push(Number(column));
  }

  output.push(operator.trim());
  return output;
}

const problems = parseInput(lines).map(transformProblem);


let grandTotal = 0;

for (const problem of problems) {
  const operator = problem.at(-1) as "+" | "*";
  const numbers = problem.slice(0, -1) as number[];

  const result = numbers.reduce(
    (acc, n) => (operator === "+" ? acc + n : acc * n),
    operator === "+" ? 0 : 1
  );

  grandTotal += result;
}

console.log(grandTotal);
