import { getRepository } from "typeorm";
import { Service } from "typedi";
import { IPortfolioVersionRepository } from "./interfaces/IPortfolioVersionRepository";
import PortfolioEntity from "../entities/portfolio.entity";
import { PortfolioVersionEntity } from "../entities/portfolioVersion.entity";

@Service()
export class PortfolioVersionRepository implements IPortfolioVersionRepository {
  private readonly portfolioVersionRepository = getRepository(
    PortfolioVersionEntity
  );

  async findOne(options: any): Promise<PortfolioVersionEntity | undefined> {
    const result = await this.portfolioVersionRepository.findOne(options);
    return result;
  }

  create(params: Partial<PortfolioVersionEntity>): PortfolioVersionEntity {
    return this.portfolioVersionRepository.create(params);
  }

  async save(
    portfolioVersion: PortfolioVersionEntity
  ): Promise<PortfolioVersionEntity> {
    const result = await this.portfolioVersionRepository.save(portfolioVersion);
    return result;
  }

  async findAll(portfolio?: PortfolioEntity): Promise<PortfolioVersionEntity[]> {
    let result: PortfolioVersionEntity[];
    if (portfolio) {
      result = await this.portfolioVersionRepository.find({ where: { portfolio }, relations: ["portfolio", "pages"] });
    } else {
      result = await this.portfolioVersionRepository.find({ relations: ["portfolio", "pages"] });
    }
    return result;
  }
}
