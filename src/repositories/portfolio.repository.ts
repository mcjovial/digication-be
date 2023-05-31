import { getRepository } from "typeorm";
import { Service } from "typedi";
import PortfolioEntity from "../entities/portfolio.entity";
import { IPortfolioRepository } from "./interfaces/IPortfolioRepository";

@Service()
export class PortfolioRepository implements IPortfolioRepository {
  private readonly portfolioRepository = getRepository(PortfolioEntity);

  async findOne(options: any): Promise<PortfolioEntity | undefined> {
    const result = await this.portfolioRepository.findOne(options);
    return result;
  }

  create(portfolio: Partial<PortfolioEntity>): PortfolioEntity {
    return this.portfolioRepository.create(portfolio);
  }

  async save(portfolio: PortfolioEntity): Promise<PortfolioEntity> {
    const result = await this.portfolioRepository.save(portfolio);
    return result;
  }

  async createQueryBuilder(): Promise<any> {
    const result = await this.portfolioRepository
      .createQueryBuilder("p")
      // .leftJoinAndSelect("p.pages", "pages")
      // .leftJoinAndSelect("p.versions", "versions")
      .getMany();
    return result;
  }
}
