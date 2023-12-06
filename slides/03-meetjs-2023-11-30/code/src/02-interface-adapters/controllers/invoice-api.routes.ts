import { IInvoiceUseCases } from "../../03-use-cases/types";
import { InvoiceUseCaseService } from "../../03-use-cases/InvoiceUseCaseService";
import { DummyInvoiceRepository } from "../repositories/DummyInvoiceRepository";
import express from "express";

const invoiceService: IInvoiceUseCases = new InvoiceUseCaseService(
  new DummyInvoiceRepository(),
);

const invoiceApi = express.Router();

invoiceApi.post("/invoice", async (req, res) => {
  const invoice = await invoiceService.createNewInvoice(req.body.orderId);

  res.json({
    invoice,
  });
});

export default invoiceApi;
