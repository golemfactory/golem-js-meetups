import * as dotenv from "dotenv";
import { TaskExecutor } from "@golem-sdk/golem-js";
import { chunkDataSet, readInputDataSet, writeChunkFile } from "./utils";
import { makeConfig } from "../golem-toolkit";

dotenv.config();

async function computeChunksOnGolem(
  executor: TaskExecutor,
  chunks: number[][],
) {
  console.time("computation");

  const tasks = chunks.map(async (inputs, chunkNumber) => {
    const chunkFile = writeChunkFile(chunkNumber, inputs);

    const result = await executor.run(async (ctx) => {
      await ctx.uploadFile(chunkFile, "/golem/work/dataset.json");
      return ctx.run(`node /src/app/dist/index.js`);
    });

    if (result) {
      return result.getOutputAsJson<number[]>();
    }
  });

  const results = await Promise.all(tasks);

  console.log("Finished computing values");
  console.timeEnd("computation");

  return results.flat();
}

(async function main() {
  const config = await makeConfig({
    image: "grisha-golem/node-fib-with-threads:latest",
  });
  const executor = await TaskExecutor.create(config);

  try {
    const inputs: number[] = readInputDataSet();
    const chunks = chunkDataSet(inputs, 100);
    const results = await computeChunksOnGolem(executor, chunks);
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
