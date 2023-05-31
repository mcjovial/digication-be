import { Inject, Service } from "typedi";
import PortfolioEntity from "../entities/portfolio.entity";
import { IPortfolioRepository } from "../repositories/interfaces/IPortfolioRepository";
import { VersionType } from "../entities/portfolioVersion.entity";
import { IPortfolioVersionRepository } from "../repositories/interfaces/IPortfolioVersionRepository";
import { PortfolioRepository } from "../repositories/portfolio.repository";
import { PortfolioVersionRepository } from "../repositories/portfolioVersion.repository";

@Service()
export class PortfolioService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @Inject(() => PortfolioRepository)
    private readonly portfolioRepository: IPortfolioRepository,
    @Inject(() => PortfolioVersionRepository)
    private readonly portfolioVersionRepository: IPortfolioVersionRepository
  ) {}

  async createPortfolio(name: string, url: string): Promise<PortfolioEntity> {
    const existingPortfolio = await this.portfolioRepository.findOne({
      name,
      url,
    });

    if (existingPortfolio) {
      throw new Error("Portfolio already exists");
    }

    const newPortfolio = this.portfolioRepository.create({
      name,
      url,
    });
    const savedNew = await this.portfolioRepository.save(newPortfolio);

    const newPortfolioVersion = this.portfolioVersionRepository.create({
      portfolio: savedNew,
      versionType: VersionType.DRAFT,
    });
    await this.portfolioVersionRepository.save(newPortfolioVersion);

    return savedNew;
  }

  async listPortfolios(): Promise<PortfolioEntity[]> {
    const result = await this.portfolioRepository.createQueryBuilder();
    return result;
  }
}
