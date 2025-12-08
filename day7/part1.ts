import * as fs from "fs";

const inputFile = "input.txt";

const fileContent = fs.readFileSync(inputFile, "utf-8");
const grid: string[] = fileContent.split(/\r?\n/);

let beams = new Map([[grid[0]!.indexOf("S"), 1]]);
let splitCount = 0;
for(let i = 0; i < grid.length; i++){
    const nextBeams: Map<number, number> = new Map();
    for(const [beam, count] of beams.entries()){
        if(grid[i]?.charAt(beam) === "."){
            nextBeams.set(beam, (nextBeams.get(beam) ?? 0) + count)
        }else{
            nextBeams.set(beam - 1, (nextBeams.get(beam - 1) ?? 0) + count);
            nextBeams.set(beam + 1, (nextBeams.get(beam + 1) ?? 0) + count);
            splitCount++
        }
    }
    beams = nextBeams
}

console.log(splitCount)