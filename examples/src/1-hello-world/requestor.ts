import * as dotenv from "dotenv";
import { LogLevel, ProposalFilters, TaskExecutor } from "@golem-sdk/golem-js";

dotenv.config();

(async function main() {
  const executor = await TaskExecutor.create({
    // What do you want to run
    package: "golem/alpine:3.18.2",

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
    const result = await executor.run(
      async (ctx) =>
        await ctx.run(`echo "This task is run on ${ctx.provider?.id}"`),
    );
    console.log("Outcome:", result?.stdout);
  } catch (err) {
    console.error("Running the task on Golem failed due to", err);
  } finally {
    await executor.end();
  }
})();
