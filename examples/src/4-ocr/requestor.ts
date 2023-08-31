import * as dotenv from "dotenv";
import assert from "assert";
import * as fs from "fs";
import { LogLevel, ProposalFilters, TaskExecutor } from "@golem-sdk/golem-js";

dotenv.config();

(async function main() {
  const executor = await TaskExecutor.create({
    // What do you want to run
    package: "golem/tesseract:latest",

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
    const sourceImageFile = __dirname + "/../../src/4-ocr/input/portal.png";

    assert(
      fs.existsSync(sourceImageFile),
      `The source image file is not present: ${sourceImageFile}`,
    );

    await executor.run(async (ctx) => {
      await ctx.uploadFile(sourceImageFile, "/golem/work/image.png");
      const result = await ctx.run(`tesseract /golem/work/image.png stdout`);
      console.log({
        result: result,
        providerId: ctx.provider?.id,
      });
    });
  } catch (err) {
    console.error("Running the task on Golem failed due to", err);
  } finally {
    await executor.end();
  }
})();
