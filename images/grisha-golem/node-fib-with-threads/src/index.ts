import os from "os";
import { Pool, spawn, Worker } from "threads";
import { readInputDataSet } from "./utils";

(async () => {
  const pool = Pool(() => spawn(new Worker("./fib.worker")), os.cpus().length);

  try {
    const inputs: number[] = readInputDataSet();
    const tasks = inputs.map((i) =>
      pool.queue((fibWorker) => {
        return fibWorker.compute(i);
      }),
    );
    const results = await Promise.all(tasks);
    console.log(JSON.stringify(results));
  } catch (err) {
    console.error("Running tasks on the pool of workers failed due to", err);
  } finally {
    await pool.terminate();
  }
})().catch((err) => console.log("Error in main", err));
