import express from "express";
import bodyParser from "body-parser";
import { IInvoiceUseCases } from "../03-use-cases/types";
import { InvoiceUseCaseService } from "../03-use-cases/InvoiceUseCaseService";
import { DummyInvoiceRepository } from "../02-interface-adapters/repositories/DummyInvoiceRepository";
import invoiceApi from "../02-interface-adapters/controllers/invoice-api.routes";

const PORT = 3000;

type StartFn = () => Promise<ShutdownFn>;
type ShutdownFn = () => void;

export function createApp(): StartFn {
  const app = express();

  app.use(bodyParser.json());
  app.use(invoiceApi);

  return async function startApp() {
    return new Promise((resolve) => {
      const server = app.listen(PORT, () => {
        console.log("App started and listening on PORT", PORT);

        resolve(function stopApp() {
          console.log("Shutdown requested");
          server.close();
          console.log("Shutdown complete");
        });
      });
    });
  };
}
