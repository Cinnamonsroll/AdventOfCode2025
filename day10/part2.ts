import * as fs from "fs";

const inputFile = "input.txt";
const lines: string[] = fs
  .readFileSync(inputFile, "utf-8")
  .trim()
  .split(/\r?\n/);

type Machine = {
  indicatorLights: boolean[];
  buttonWiring: number[][];
  joltageRequirements: number[];
};

function parseMachineFromLine(line: string): Machine {
  const indicatorLights =
    line
      .match(/\[([.#]+)\]/)?.[1]
      ?.split("")
      .map((item) => item === "#") ?? [];

  const buttonWiring = line
    .matchAll(/\(([0-9,]+)\)/g)
    .map((item) => item[1] ?? "")
    .map((item) => item.split(",").map((o) => parseInt(o, 10)))
    .toArray();

  const joltageRequirements =
    line
      .match(/\{([0-9,]+)\}/)?.[1]
      ?.split(",")
      .map((n) => parseInt(n, 10)) ?? [];

  return {
    indicatorLights,
    buttonWiring,
    joltageRequirements,
  };
}

function solveRestrictedSystem(
  matrix: number[][],
  target: number[],
  bounds: number[],
  numberOfColumns: number,
  numberOfRows: number
): number {
  const matrixCopy = matrix.map((row) => [...row]);
  const rhs = [...target];

  const pivotColumnIndices: number[] = [];
  let pivotRow = 0;
  const columnToPivotRow = new Map<number, number>();

  for (let col = 0; col < numberOfColumns && pivotRow < numberOfRows; col++) {
    let sel = pivotRow;
    while (sel < numberOfRows && Math.abs(matrixCopy[sel]![col]!) < 1e-9) sel++;

    if (sel === numberOfRows) continue;

    [matrixCopy[pivotRow], matrixCopy[sel]] = [
      matrixCopy[sel]!,
      matrixCopy[pivotRow]!,
    ];
    [rhs[pivotRow], rhs[sel]] = [rhs[sel]!, rhs[pivotRow]!];

    const pivotVal = matrixCopy[pivotRow]![col]!;
    for (let j = col; j < numberOfColumns; j++)
      matrixCopy[pivotRow]![j]! /= pivotVal;
    rhs[pivotRow]! /= pivotVal;

    for (let i = 0; i < numberOfRows; i++) {
      if (i === pivotRow) continue;
      const factor = matrixCopy[i]![col]!;
      if (Math.abs(factor) > 1e-9) {
        for (let j = col; j < numberOfColumns; j++)
          matrixCopy[i]![j]! -= factor * matrixCopy[pivotRow]![j]!;
        rhs[i]! -= factor * rhs[pivotRow]!;
      }
    }

    pivotColumnIndices.push(col);
    columnToPivotRow.set(col, pivotRow);
    pivotRow++;
  }

  const isPivot = new Set(pivotColumnIndices);
  const freeVars: number[] = [];
  for (let j = 0; j < numberOfColumns; j++)
    if (!isPivot.has(j)) freeVars.push(j);

  for (let i = pivotRow; i < numberOfRows; i++)
    if (Math.abs(rhs[i]!) > 1e-4) return 0;

  let best = Infinity;
  const curSol = new Array(numberOfColumns).fill(0);

  const search = (idx: number, cost: number) => {
    if (cost >= best) return;

    if (idx === freeVars.length) {
      let total = cost;
      let ok = true;

      for (let i = pivotColumnIndices.length - 1; i >= 0; i--) {
        const col = pivotColumnIndices[i]!;
        const row = columnToPivotRow.get(col)!;

        let v = rhs[row]!;
        for (let j = col + 1; j < numberOfColumns; j++)
          if (Math.abs(matrixCopy[row]![j]!) > 1e-9)
            v -= matrixCopy[row]![j]! * curSol[j]!;

        if (Math.abs(v - Math.round(v)) > 1e-4) {
          ok = false;
          break;
        }
        v = Math.round(v);
        if (v < 0 || v > bounds[col]!) {
          ok = false;
          break;
        }

        curSol[col] = v;
        total += v;
        if (total >= best) {
          ok = false;
          break;
        }
      }

      if (ok) best = total;
      return;
    }

    const varIndex = freeVars[idx]!;
    const limit = bounds[varIndex]!;

    for (let v = 0; v <= limit; v++) {
      curSol[varIndex] = v;
      search(idx + 1, cost + v);
    }
  };

  search(0, 0);
  return best === Infinity ? 0 : best;
}

function findMinimumJoltagePresses(machine: Machine): number {
  const R = machine.joltageRequirements.length;
  const C = machine.buttonWiring.length;

  const matrix: number[][] = Array.from({ length: R }, () => Array(C).fill(0));
  const bounds = new Array(C).fill(Infinity);

  for (let j = 0; j < C; j++) {
    const wire = machine.buttonWiring[j];
    if (wire && wire.length > 0) {
      for (const r of wire) {
        if (r < R) {
          matrix[r]![j] = 1;
          bounds[j] = Math.min(bounds[j]!, machine.joltageRequirements[r]!);
        }
      }
    } else {
      bounds[j] = 0;
    }
  }

  for (let j = 0; j < C; j++) if (bounds[j] === Infinity) bounds[j] = 0;

  return solveRestrictedSystem(
    matrix,
    [...machine.joltageRequirements],
    bounds,
    C,
    R
  );
}

const result = lines
  .map(parseMachineFromLine)
  .map(findMinimumJoltagePresses)
  .reduce((a, b) => a + b, 0);

console.log(result);
