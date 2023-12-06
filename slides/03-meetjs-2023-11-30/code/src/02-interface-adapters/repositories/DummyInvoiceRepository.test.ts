import { InvoiceEntity } from "../../04-entities/InvoiceEntity";
import { DummyInvoiceRepository } from "./DummyInvoiceRepository";

describe("Dummy Invoice Repository", () => {
  test("Can persist a invoice", async () => {
    const repo = new DummyInvoiceRepository();
    const invoice = new InvoiceEntity(123);

    const updated = await repo.saveInvoice(invoice);

    expect(updated.orderId).toEqual(invoice.orderId);
  });
});
