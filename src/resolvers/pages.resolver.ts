import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { PageService } from "../services/pages.service";
import PageEntity from "../entities/PageEntity";

@Resolver(() => PageEntity)
export class PageResolver {
  private readonly pageService: PageService
  
  @Mutation(() => PageEntity)
  async createPage(
    @Arg('name') name: string,
    @Arg('url') url: string,
    @Arg('portfolioId') portfolioId: string
  ): Promise<PageEntity> {
    const page = await this.pageService.createPage(name, url, portfolioId);
    return page;
  }

  @Query(() => [PageEntity], { description: 'get all portfolio pages for a given a portfolio version' })
  async getAllPagesForAPortfolioVersion(
    @Arg('portfolioVersionId') portfolioVersionId: string
  ): Promise<PageEntity[]> {
    const pages = await this.pageService.getAllPagesForAPortfolioVersion(portfolioVersionId);
    return pages;
  }
}