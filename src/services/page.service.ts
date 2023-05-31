import { Inject, Service } from "typedi";
import PageEntity from "../entities/page.entity";
import { PortfolioRepository } from "../repositories/portfolio.repository";
import { PortfolioVersionRepository } from "../repositories/portfolioVersion.repository";
import { PageRepository } from "../repositories/page.repository";
import { IPageRepository } from "../repositories/interfaces/IPageRepository";
import { IPortfolioRepository } from "../repositories/interfaces/IPortfolioRepository";
import { IPortfolioVersionRepository } from "../repositories/interfaces/IPortfolioVersionRepository";
import { VersionType } from "../entities/portfolioVersion.entity";

@Service()
export class PageService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @Inject(() => PortfolioRepository)
    private readonly portfolioRepository: IPortfolioRepository,
    @Inject(() => PortfolioVersionRepository)
    private readonly portfolioVersionRepository: IPortfolioVersionRepository,
    @Inject(() => PageRepository)
    private readonly pageRepository: IPageRepository
  ) {}

  async createPage(
    name: string,
    url: string,
    portfolioId: number
  ): Promise<PageEntity> {
    const portfolio = await this.portfolioRepository.findOne(portfolioId);
    if (!portfolio) {
      throw new Error("Portfolio not found");
    }

    const existingPage = await this.pageRepository.findOne({
      where: { name, url, portfolio },
    });

    if (existingPage) {
      throw new Error("Page already exists");
    }

    const draftVersion = await this.portfolioVersionRepository.findOne({
      where: { portfolio, versionType: VersionType.DRAFT },
    });

    const pagesOfDraftVersion = await this.pageRepository.find({
      where: { portfolioVersion: draftVersion },
    });

    if (pagesOfDraftVersion.length >= 3) {
      throw new Error("Draft version already has 3 pages");
    }

    const newPage = this.pageRepository.create({
      name,
      url,
      portfolio,
      portfolioVersion: draftVersion,
    });

    await this.pageRepository.save(newPage);
    return newPage;
  }

  async getAllPagesForAPortfolioVersion(
    portfolioVersionId: number
  ): Promise<PageEntity[]> {
    const portfolioVersion = await this.portfolioVersionRepository.findOne(
      portfolioVersionId
    );
    if (!portfolioVersion) {
      throw new Error("Portfolio not found");
    }

    const pages = await this.pageRepository.find({
      where: { portfolioVersion },
      relations: ["portfolioVersion"],
    });

    return pages;
  }
}
