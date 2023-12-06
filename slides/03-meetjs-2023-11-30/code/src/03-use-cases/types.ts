import { InvoiceEntity } from "../04-entities/InvoiceEntity";

export interface IInvoiceUseCases {
  createNewInvoice(orderId: number): Promise<InvoiceEntity>;
}

export interface IInvoiceRepository {
  saveInvoice(invoice: InvoiceEntity): Promise<InvoiceEntity>;
}
