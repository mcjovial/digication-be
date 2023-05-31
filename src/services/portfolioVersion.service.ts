import { Inject, Service } from "typedi";
import {
  PortfolioVersionEntity,
  VersionType,
} from "../entities/portfolioVersion.entity";
import { PortfolioRepository } from "../repositories/portfolio.repository";
import { PortfolioVersionRepository } from "../repositories/portfolioVersion.repository";
import { IPortfolioRepository } from "../repositories/interfaces/IPortfolioRepository";
import { IPortfolioVersionRepository } from "../repositories/interfaces/IPortfolioVersionRepository";
import { PageRepository } from "../repositories/page.repository";
import { IPageRepository } from "../repositories/interfaces/IPageRepository";

@Service()
export class PortfolioVersionService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @Inject(() => PortfolioRepository)
    private readonly portfolioRepository: IPortfolioRepository,
    @Inject(() => PortfolioVersionRepository)
    private readonly portfolioVersionRepository: IPortfolioVersionRepository,
    @Inject(() => PageRepository)
    private readonly pageRepository: IPageRepository
  ) {}

  async createSnapshotFromDraft(
    portfolioId: number,
    pagesId: number[]
  ): Promise<PortfolioVersionEntity> {
    if (pagesId.length > 5) {
      throw new Error("Too many pages, limit is 5");
    }

    const portfolio = await this.portfolioRepository.findOne(portfolioId);
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

    const portfolioVersion = this.portfolioVersionRepository.create({
      portfolio,
      versionType: VersionType.SNAPSHOT,
      pages: pagesToBeAdded,
    });

    const result = await this.portfolioVersionRepository.save(portfolioVersion);
    return result;
  }

  async createSnapshotPortfolioVersion(
    portfolioId: number
  ): Promise<PortfolioVersionEntity> {
    const portfolio = await this.portfolioRepository.findOne(portfolioId);
    if (!portfolio) throw new Error("Portfolio not found");

    const portfolioVersion = this.portfolioVersionRepository.create({
      portfolio,
      versionType: VersionType.SNAPSHOT,
    });

    const result = await this.portfolioVersionRepository.save(portfolioVersion);
    return result;
  }

  async portfolioVersions(
    portfolioId: number
  ): Promise<PortfolioVersionEntity[]> {
    const portfolio = await this.portfolioRepository.findOne(portfolioId);
    if (!portfolio) throw new Error("Portfolio not found");

    const result = await this.portfolioVersionRepository.findAll(portfolio);
    return result;
  }

  async getAllAvailablePortfolioVersions(
  ): Promise<PortfolioVersionEntity[]> {
    const result = await this.portfolioVersionRepository.findAll();
    if (!result) throw new Error("No portfolio versions found");
    return result;
  }
}
