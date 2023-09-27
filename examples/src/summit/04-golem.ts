import * as dotenv from "dotenv";
import { TaskExecutor } from "@golem-sdk/golem-js";
import { readInputDataSet } from "./utils";
import { makeConfig } from "../golem-toolkit";

dotenv.config();

async function computeOnGolem(executor: TaskExecutor, inputs: number[]) {
  console.time("computation");

  executor.beforeEach((ctx) =>
    ctx.uploadFile(
      __dirname + "/tasks/fib-compute.task.js",
      "/golem/work/fib-compute.task.js",
    ),
  );

  const tasks = inputs.map((input) =>
    executor.run((ctx) =>
      ctx.run(`node /golem/work/fib-compute.task.js ${input}`),
    ),
  );

  const results = await Promise.all(tasks);

  console.log("Finished computing values");
  console.timeEnd("computation");

  return results;
}

(async function main() {
  const config = await makeConfig({
    image: "golem/node:20-alpine",
  });
  const executor = await TaskExecutor.create(config);

  try {
    const inputs: number[] = readInputDataSet();
    const results = await computeOnGolem(executor, inputs);
    console.log(
      "Number of inputs: %d, number of results %d",
      inputs.length,
      results.length,
    );
  } catch (err) {
    console.error("Running the task on Golem failed due to", err);
  } finally {
    await executor.end();
  }
})();
