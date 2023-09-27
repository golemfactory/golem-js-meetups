import * as dotenv from "dotenv";
import { TaskExecutor } from "@golem-sdk/golem-js";
import { makeConfig } from "../golem-toolkit";

dotenv.config();

(async function main() {
  const config = await makeConfig({
    image: "golem/alpine:3.18.2",
  });
  const executor = await TaskExecutor.create(config);

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
