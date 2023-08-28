import * as child_process from "child_process";
import * as fs from "fs";

console.log("Setting up env");

try {
  const keyList = JSON.parse(
    child_process.execSync("yagna app-key list --json").toString(),
  );

  if (keyList.length === 0) {
    console.error(
      "There are no keys present! Create one with 'yagna app-key create' and try again.",
    );
    process.exit(1);
  }

  const [entry] = keyList;

  fs.writeFileSync(".env", `YAGNA_APPKEY="${entry.key}"`);
  console.log("The .env file has been generated");
} catch (err) {
  // @ts-ignore
  if ("status" in err && err.status === 1) {
    console.error(
      "Could not retrieve app-key, is did you 'yagna service run'?",
    );
    process.exit(1);
  } else {
    console.error("The script failed due to this error", err);
    process.exit(1);
  }
}
