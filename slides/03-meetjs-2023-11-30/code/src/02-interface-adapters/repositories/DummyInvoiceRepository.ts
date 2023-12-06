import { IInvoiceRepository } from "../../03-use-cases/types";
import { InvoiceEntity } from "../../04-entities/InvoiceEntity";

export class DummyInvoiceRepository implements IInvoiceRepository {
  saveInvoice(invoice: InvoiceEntity): Promise<InvoiceEntity> {
    return Promise.resolve(invoice);
  }
}
