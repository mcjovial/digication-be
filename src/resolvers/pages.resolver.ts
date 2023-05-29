import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { PageService } from "../services/pages.service";
import PageEntity from "../entities/PageEntity";

@Resolver(() => PageEntity)
@Service()
export class PageResolver {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly pageService: PageService) {}
  
  @Mutation(() => PageEntity, { description: "Create a page" })
  async createPage(
    @Arg('name') name: string,
    @Arg('url') url: string,
    @Arg('portfolioId') portfolioId: string
  ): Promise<PageEntity> {
    const page = await this.pageService.createPage(name, url, portfolioId);
    return page;
  }

  @Mutation(() => PageEntity, { description: "Change the portfolio version of a page" })
  async changePortfolioVersionOfPage(
    @Arg('pageId') pageId: string,
    @Arg('versionId') versionId: string,
  ): Promise<PageEntity | undefined> {
    const page = await this.pageService.changePortfolioVersionOfPage(pageId, versionId);
    return page;
  }

  @Query(() => [PageEntity], { description: 'get all portfolio pages for a given a portfolio version' })
  async getAllPagesForAPortfolioVersion(
    @Arg('portfolioVersionId') portfolioVersionId: string
  ): Promise<PageEntity[]> {
    const pages = await this.pageService.getAllPagesForAPortfolioVersion(portfolioVersionId);
    return pages;
  }

  @Query(() => [PageEntity], { description: 'Get all pages' })
  async getAllPages(): Promise<PageEntity[]> {
    const pages = await this.pageService.getAllPages();
    return pages;
  }
}
