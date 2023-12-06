import { InvoiceUseCaseService } from "./InvoiceUseCaseService";
import {
  deepEqual,
  imock,
  instance,
  objectContaining,
  verify,
  when,
} from "@johanblumenberg/ts-mockito";
import { IInvoiceRepository } from "./types";
import { InvoiceEntity } from "../04-entities/InvoiceEntity";

describe("Invoice Use Case Service", () => {
  describe("create invoices", () => {
    test("I can create an invoice", async () => {
      const repo = imock<IInvoiceRepository>();
      const service = new InvoiceUseCaseService(instance(repo));

      const expected = new InvoiceEntity(123);
      when(repo.saveInvoice(objectContaining({ orderId: 123 }))).thenResolve(
        expected,
      );

      const invoice = await service.createNewInvoice(123);

      expect(invoice.orderId).toEqual(expected.orderId);
      verify(repo.saveInvoice(objectContaining({ orderId: 123 }))).once();
    });
  });
});
