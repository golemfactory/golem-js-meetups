import { createApp } from "./01-frameworks-and-drivers/app";

(async () => {
  const startApp = createApp();

  const shutdownApp = await startApp();

  process.on("SIGTERM", shutdownApp);
  process.on("SIGINT", shutdownApp);
})().catch((err) => console.error(err, "Error in main"));
