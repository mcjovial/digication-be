import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { PageRepository } from "../repositories/pages.repository";
import { PortfolioRepository } from "../repositories/portfolios.repository";
import { PortfolioVersionRepository } from "../repositories/portfolio-versions.repository";
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

  async createPage(name: string, url: string, portfolioId: string): Promise<PageEntity> {
    const portfolio = await this.portfolioRepository.findOne({ where: { id: portfolioId } });
    if (!portfolio) throw new Error("Portfolio not found");

    const existingPage = await this.pageRepository.findOne({ where: { name, url, portfolio } });
    if (!existingPage) throw new Error("Page already exists");

    const draftVersion = await this.portfolioVersionRepository.findOne({
      where: { portfolio, versionType: VersionType.DRAFT }
    });
    const pagesOfDraftVersion = await this.pageRepository.find({
      where: { portfolioVersion: draftVersion }
    });
    if (pagesOfDraftVersion.length >= 3) throw new Error('Draft version already has 3 pages');

    const newPage = this.pageRepository.create({
      name,
      url,
      portfolio,
      portfolioVersion: draftVersion
    });
    await this.pageRepository.save(newPage);
    return newPage;
  }

  async getAllPagesForAPortfolioVersion(portfolioVersionId: string): Promise<PageEntity[]> {
    const portfolioVersion = await this.portfolioVersionRepository.findOne({ where: { id: portfolioVersionId } });
    if (!portfolioVersion) {
      throw new Error('Portfolio version not found');
    }

    const pages = await this.pageRepository.find({ where: { portfolioVersion }, relations: ['portfolioVersion'] });

    return pages;
  }
}