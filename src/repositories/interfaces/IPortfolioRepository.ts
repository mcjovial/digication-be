import PortfolioEntity from "../../entities/portfolio.entity";

export interface IPortfolioRepository {
  findOne(options: any): Promise<PortfolioEntity | undefined>;
  create(portfolio: Partial<PortfolioEntity>): PortfolioEntity;
  save(portfolio: PortfolioEntity): Promise<PortfolioEntity>;
  createQueryBuilder(): any;
}
