import { InvoiceEntity } from "./InvoiceEntity";

describe("Invoice Entity", () => {
  test("Can be created at all", () => {
    const invoice = new InvoiceEntity(123);

    expect(invoice.orderId).toEqual(123);
  });
});
