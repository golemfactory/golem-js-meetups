import * as dotenv from "dotenv";
import assert from "assert";
import * as fs from "fs";
import { TaskExecutor } from "@golem-sdk/golem-js";
import { makeConfig } from "../golem-toolkit";

dotenv.config();

(async function main() {
  const config = await makeConfig({
    image: "golem/tesseract:latest",
  });

  const executor = await TaskExecutor.create(config);

  try {
    const sourceImageFile = __dirname + "/../../src/04-ocr/input/portal.png";

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
