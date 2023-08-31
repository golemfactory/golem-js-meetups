import * as dotenv from "dotenv";
import assert from "assert";
import * as fs from "fs";
import { LogLevel, ProposalFilters, TaskExecutor } from "@golem-sdk/golem-js";

dotenv.config();

(async function main() {
  const executor = await TaskExecutor.create({
    // What do you want to run
    package: "golem/node:20-alpine",

    // How much you wish to spend
    budget: 0.5,
    proposalFilter: ProposalFilters.limitPriceFilter({
      start: 0.1,
      cpuPerSec: 0.1 / 3600,
      envPerSec: 0.1 / 3600,
    }),

    // Where you want to spend
    payment: {
      network: "polygon",
    },

    // Control the execution of tasks
    maxTaskRetries: 0,

    // Useful for debugging
    logLevel: LogLevel.Info,
    taskTimeout: 5 * 60 * 1000,
  });

  try {
    const taskSourceFile = __dirname + "/tasks/fib-compute.task.js";

    assert(
      fs.existsSync(taskSourceFile),
      "The source task file is not present",
    );

    // Define your inputs
    const inputs = [5, 10, 15, 20, 25, 30, 35, 40];

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
