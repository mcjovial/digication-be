import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import PortfolioEntity from "../entities/portfolio.entity";
import { PortfolioService } from "../services/portfolio.service";

@Resolver(() => PortfolioEntity)
@Service()
export class PortfolioResolver {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly portfolioService: PortfolioService) {}

  @Mutation(() => PortfolioEntity, { description: "Create a portfolio" })
  async createPortfolio(
    @Arg("name") name: string,
    @Arg("url") url: string
  ): Promise<PortfolioEntity | undefined> {
    const result = await this.portfolioService.createPortfolio(name, url);
    return result;
  }

  @Query(() => [PortfolioEntity], { description: "List all portfolios" })
  async listPortfolios(): Promise<PortfolioEntity[]> {
    const result = await this.portfolioService.listPortfolios();
    return result;
  }
}
