import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import {
  PortfolioVersionEntity,
  VersionType,
} from "../entities/PortfolioVersionEntity";
import { PageRepository } from "../repositories/pages.repository";
import { PortfolioVersionRepository } from "../repositories/portfolioVersions.repository";
import { PortfolioRepository } from "../repositories/portfolios.repository";

@Service()
export class PortfolioVersionService {
  @InjectRepository(PageRepository)
  private readonly pageRepository: PageRepository;

  @InjectRepository(PortfolioRepository)
  private readonly portfolioRepository: PortfolioRepository;

  @InjectRepository(PortfolioVersionRepository)
  private readonly portfolioVersionRepository: PortfolioVersionRepository;

  async createSnapshotFromDraft(
    portfolioId: string,
    pagesId: string[]
  ): Promise<PortfolioVersionEntity> {
    if (pagesId.length > 5) {
      throw new Error("Too many pages, limit is 5");
    }

    const portfolio = await this.portfolioRepository.findOne({
      where: { id: portfolioId },
    });
    if (!portfolio) {
      throw new Error("Portfolio not found");
    }

    const draftVersion = await this.portfolioVersionRepository.findOne({
      where: { portfolio, versionType: VersionType.DRAFT },
    });

    const pagesOfDraftVersion = await this.pageRepository.find({
      where: { portfolioVersion: draftVersion },
    });

    const pagesToBeAdded = pagesOfDraftVersion.filter((page) =>
      pagesId.includes(page.id)
    );

    const newSnapshot = this.portfolioVersionRepository.create({
      portfolio,
      versionType: VersionType.SNAPSHOT,
      pages: pagesToBeAdded,
    });
    await this.portfolioVersionRepository.save(newSnapshot);

    return newSnapshot;
  }

  async createPublishedPortfolioVersion(
    portfolioId: string
  ): Promise<PortfolioVersionEntity> {
    const portfolio = await this.portfolioRepository.findOne(portfolioId);
    if (!portfolio) throw new Error("Portfolio not found");

    const alreadyExists = await this.portfolioVersionRepository.findOne({ where: { portfolio, versionType: VersionType.PUBLISHED } })
    if (alreadyExists) throw new Error('Version already exists for this portfolio');

    const newPublishedVersion = this.portfolioVersionRepository.create({
      portfolio,
      versionType: VersionType.PUBLISHED,
    });
    await this.portfolioVersionRepository.save(newPublishedVersion);

    return newPublishedVersion;
  }

  async getAllAvailablePortfolioVersions(): Promise<PortfolioVersionEntity[]> {
    const portfolioVersions = await this.portfolioVersionRepository.find({ relations: ["portfolio", "pages"]});
    if (!portfolioVersions) throw new Error("No portfolio versions found");
    return portfolioVersions;
  }
}
