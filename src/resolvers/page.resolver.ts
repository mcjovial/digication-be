import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import PageEntity from "../entities/page.entity";
import { PageService } from "../services/page.service";

@Resolver(() => PageEntity)
@Service()
export class PageResolver {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly pageService: PageService) {}

  @Mutation(() => PageEntity, { description: "Create a page" })
  async createPage(
    @Arg("name") name: string,
    @Arg("url") url: string,
    @Arg("portfolioId") portfolioId: number
  ): Promise<PageEntity> {
    const result = await this.pageService.createPage(name, url, portfolioId);
    return result;
  }

  @Query(() => [PageEntity], {
    description: "get all portfolio pages for a given a portfolio version",
  })
  async getAllPagesForAPortfolioVersion(
    @Arg("portfolioVersionId") portfolioVersionId: number
  ): Promise<PageEntity[]> {
    const result = await this.pageService.getAllPagesForAPortfolioVersion(
      portfolioVersionId
    );
    return result;
  }
}
