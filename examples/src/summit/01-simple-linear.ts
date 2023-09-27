import { fib } from "./lib";
import { readInputDataSet } from "./utils";

const inputs = readInputDataSet();

console.time("computation");

for (const i of inputs) {
  console.log("fib(%d)=%d", i, fib(i));
}

console.log(
  "Finished computing values for %d inputs, total time for computation",
  inputs.length,
);
console.timeEnd("computation");
