import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { PageRepository } from "../repositories/pages.repository";
import { PortfolioRepository } from "../repositories/portfolios.repository";
import { PortfolioVersionRepository } from "../repositories/portfolioVersions.repository";
import { VersionType } from "../entities/PortfolioVersionEntity";
import PageEntity from "../entities/PageEntity";

@Service()
export class PageService {
  @InjectRepository(PageRepository)
  private readonly pageRepository: PageRepository;

  @InjectRepository(PortfolioRepository)
  private readonly portfolioRepository: PortfolioRepository;

  @InjectRepository(PortfolioVersionRepository)
  private readonly portfolioVersionRepository: PortfolioVersionRepository;

  async createPage(
    name: string,
    url: string,
    portfolioId: string
  ): Promise<PageEntity> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id: portfolioId },
    });
    if (!portfolio) throw new Error("Portfolio not found");

    const existingPage = await this.pageRepository.findOne({
      where: { name, url, portfolio },
    });
    if (existingPage) throw new Error("Page already exists");

    const draftVersion = await this.portfolioVersionRepository.findOne({
      where: { portfolio, versionType: VersionType.DRAFT },
    });
    const pagesOfDraftVersion = await this.pageRepository.find({
      where: { portfolioVersion: draftVersion },
    });
    if (pagesOfDraftVersion.length >= 3)
      throw new Error("Draft version already has 3 pages");

    const newPage = this.pageRepository.create({
      name,
      url,
      portfolio,
      portfolioVersion: draftVersion,
    });
    await this.pageRepository.save(newPage);
    return newPage;
  }

  async changePortfolioVersionOfPage(pageId: string, versionId: string): Promise<PageEntity | undefined> {
    const version = await this.portfolioVersionRepository.findOne({ where: { id: versionId } });
    await this.pageRepository.update(pageId, { portfolioVersion: version });
    const page = await this.pageRepository.findOne({ where: { id: pageId } });
    return page;
  }

  async getAllPagesForAPortfolioVersion(
    portfolioVersionId: string
  ): Promise<PageEntity[]> {
    const portfolioVersion = await this.portfolioVersionRepository.findOne({
      where: { id: portfolioVersionId },
    });
    if (!portfolioVersion) {
      throw new Error("Portfolio version not found");
    }

    const pages = await this.pageRepository.find({
      where: { portfolioVersion },
      relations: ["portfolio", "portfolioVersion"],
    });

    return pages;
  }

  async getAllPages(): Promise<PageEntity[]> {
    const pages = await this.pageRepository.find({
      relations: ["portfolio", "portfolioVersion"]
    });
    return pages;
  }
}
