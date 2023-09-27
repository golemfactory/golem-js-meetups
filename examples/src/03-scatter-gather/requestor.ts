import * as dotenv from "dotenv";
import assert from "assert";
import * as fs from "fs";
import { TaskExecutor } from "@golem-sdk/golem-js";
import { makeConfig } from "../golem-toolkit";

dotenv.config();

(async function main() {
  const config = await makeConfig({
    image: "golem/node:20-alpine",
  });
  const executor = await TaskExecutor.create(config);

  try {
    const taskSourceFile = __dirname + "/tasks/fib-compute.task.js";

    assert(
      fs.existsSync(taskSourceFile),
      "The source task file is not present",
    );

    // Define your inputs
    const inputs = [...Array(30).keys()];

    // Build the task list
    const tasks = inputs.map((input) =>
      executor.run(async (ctx) => {
        await ctx.uploadFile(taskSourceFile, "/golem/work/fib-compute.task.js");
        const result = await ctx.run(
          `node /golem/work/fib-compute.task.js ${input}`,
        );
        return {
          result: result.getOutputAsJson(),
          providerId: ctx.provider?.id,
        };
      }),
    );

    // Run the tasks accepting that some of them might fail
    const outcomes = await Promise.allSettled(tasks);

    // Collect outcomes
    const summary = outcomes.map((out) =>
      out.status === "fulfilled" ? out.value : {},
    );

    // And display them
    console.log("Outcomes:", summary);
  } catch (err) {
    console.error("Running the task on Golem failed due to", err);
  } finally {
    await executor.end();
  }
})();
