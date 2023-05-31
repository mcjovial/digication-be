import PortfolioEntity from "../../entities/portfolio.entity";
import { PortfolioVersionEntity } from "../../entities/portfolioVersion.entity";

export interface IPortfolioVersionRepository {
  findOne(options: any): Promise<PortfolioVersionEntity | undefined>;
  create(params: Partial<PortfolioVersionEntity>): PortfolioVersionEntity;
  save(
    portfolioVersion: PortfolioVersionEntity
  ): Promise<PortfolioVersionEntity>;
  findAll(portfolio?: PortfolioEntity): Promise<PortfolioVersionEntity[]>;
}
