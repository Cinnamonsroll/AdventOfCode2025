import * as fs from "fs";

type Range = { lower: number; upper: number };

const inputFile = "input.txt";
const fileContent = fs.readFileSync(inputFile, "utf-8");

const parts = fileContent.split(/\r?\n\r?\n/g);
const rangesRaw = parts[0] ?? "";
const idsRaw = parts[1] ?? "";

const rangeLines = rangesRaw.split(/\r?\n/).filter(Boolean);
const ingredientIDLines = idsRaw.split(/\r?\n/).filter(Boolean);

const parsedRanges: Range[] = [];

for (const line of rangeLines) {
    const [l, u] = line.split("-");
    if (l !== undefined && u !== undefined) {
        parsedRanges.push({ lower: Number(l), upper: Number(u) });
    }
}

let freshIngredients = 0;

for (const idStr of ingredientIDLines) {
    const id = Number(idStr);
    for (const { lower, upper } of parsedRanges) {
        if (id >= lower && id <= upper) {
            freshIngredients++;
            break;
        }
    }
}

console.log(freshIngredients);
