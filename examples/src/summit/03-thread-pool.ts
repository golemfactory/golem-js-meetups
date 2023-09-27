import os from "os";
import { Pool, spawn, Worker } from "threads";
import { readInputDataSet } from "./utils";

(async () => {
  const pool = Pool(
    () => spawn(new Worker("./threads/fib.worker")),
    os.cpus().length,
  );

  try {
    const inputs: number[] = readInputDataSet();

    console.time("computation");

    const tasks = inputs.map((i) =>
      pool.queue((fibWorker) => {
        return fibWorker.compute(i);
      }),
    );
    await Promise.all(tasks);

    console.log(
      "Finished computing values for %d inputs, total time for computation",
      inputs.length,
    );
    console.timeEnd("computation");
  } catch (err) {
    console.error("Running tasks on the pool of workers failed due to", err);
  } finally {
    await pool.terminate();
  }
})().catch((err) => console.log("Error in main", err));
