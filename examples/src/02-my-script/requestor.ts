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
