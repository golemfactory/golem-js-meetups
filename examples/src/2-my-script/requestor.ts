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
  });

  try {
    const taskSourceFile = __dirname + "/tasks/fib-compute.task.js";

    assert(
      fs.existsSync(taskSourceFile),
      "The source task file is not present",
    );

    const result = await executor.run(async (ctx) => {
      await ctx.uploadFile(taskSourceFile, "/golem/work/fib-compute.task.js");
      return ctx.run(`node /golem/work/fib-compute.task.js 10`);
    });

    console.log("Outcome:", result?.getOutputAsJson());
  } catch (err) {
    console.error("Running the task on Golem failed due to", err);
  } finally {
    await executor.end();
  }
})();
