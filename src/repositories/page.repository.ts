import { getRepository } from "typeorm";
import { Service } from "typedi";
import { IPageRepository } from "./interfaces/IPageRepository";
import PageEntity from "../entities/page.entity";

@Service()
export class PageRepository implements IPageRepository {
  private readonly pageRepository = getRepository(PageEntity);

  async find(options: any): Promise<PageEntity[]> {
    const result = await this.pageRepository.find(options);
    return result;
  }

  async findOne(options: any): Promise<PageEntity | undefined> {
    const result = await this.pageRepository.findOne(options);
    return result;
  }

  create(page: Partial<PageEntity>): PageEntity {
    return this.pageRepository.create(page);
  }

  async save(page: PageEntity): Promise<PageEntity> {
    const result = await this.pageRepository.save(page);
    return result;
  }
}
