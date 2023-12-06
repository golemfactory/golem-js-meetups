import { IInvoiceRepository, IInvoiceUseCases } from "./types";
import { InvoiceEntity } from "../04-entities/InvoiceEntity";

export class InvoiceUseCaseService implements IInvoiceUseCases {
  constructor(private readonly repo: IInvoiceRepository) {}

  async createNewInvoice(orderId: number): Promise<InvoiceEntity> {
    const fresh = new InvoiceEntity(orderId);
    const updated = await this.repo.saveInvoice(fresh);
    return updated;
  }
}
