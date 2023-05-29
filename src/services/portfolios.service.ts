import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { VersionType } from "../entities/PortfolioVersionEntity";
import { PortfolioRepository } from "../repositories/portfolios.repository";
import { PortfolioVersionRepository } from "../repositories/portfolioVersions.repository";
import PortfolioEntity from "../entities/PortfolioEntity";

@Service()
export class PortfolioService {
  @InjectRepository(PortfolioRepository)
  private readonly portfolioRepository: PortfolioRepository;

  @InjectRepository(PortfolioVersionRepository)
  private readonly portfolioVersionRepository: PortfolioVersionRepository;

  async createPortfolio(name: string, url: string): Promise<PortfolioEntity> {
    // eslint-disable-next-line no-console
    console.log('>>>>>', name, url);

    const existingPortfolio = await this.portfolioRepository.findOne({
      where: { name, url },
    });
    if (existingPortfolio) throw new Error("Portfolio already exists");

    const newPortfolio = this.portfolioRepository.create({ name, url });
    await this.portfolioRepository.save(newPortfolio);

    const newPortfolioVersion = this.portfolioVersionRepository.create({
      portfolio: newPortfolio,
      versionType: VersionType.DRAFT,
    });

    await this.portfolioVersionRepository.save(newPortfolioVersion);

    return newPortfolio;
  }

  async getAllPortfolios(): Promise<PortfolioEntity[]> {
    const portfolios = await this.portfolioRepository
      .createQueryBuilder("p")
      .leftJoinAndSelect("p.pages", "pages")
      .leftJoinAndSelect("p.versions", "versions")
      .getMany();

    return portfolios;
  }
}
