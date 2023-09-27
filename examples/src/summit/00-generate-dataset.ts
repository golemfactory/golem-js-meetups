import * as fs from "fs";

export function generateInputs(min: number, max: number, count: number) {
  console.log(
    "Generating %d numbers, where min=%d and max=%d",
    count,
    min,
    max,
  );
  return Array.from({ length: count }, () =>
    Math.floor(Math.random() * (max - min + 1) + min),
  );
}

const dataSet = generateInputs(
  parseInt(process.argv[2]),
  parseInt(process.argv[3]),
  parseInt(process.argv[4]),
);

fs.writeFileSync("./dataset.json", JSON.stringify(dataSet));

console.log("Generated the dataset and stored in 'dataset.json' file");
