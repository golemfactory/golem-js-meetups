import { fib } from "./lib";
import { readInputDataSet } from "./utils";

(async () => {
  const inputs = readInputDataSet();

  console.time("computation");

  const tasks = inputs.map((input) => Promise.resolve(fib(input)));
  await Promise.all(tasks);

  console.log(
    "Finished computing values for %d inputs, total time for computation",
    inputs.length,
  );
  console.timeEnd("computation");
})().catch((err) => console.log("Error in main", err));
