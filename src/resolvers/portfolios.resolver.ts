import { Mutation, Arg, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import PortfolioEntity from "../entities/PortfolioEntity";
import { PortfolioService } from "../services/portfolios.service";

@Resolver(() => PortfolioEntity)
@Service()
export class PortfolioResolver {
  private readonly portfolioService: PortfolioService;

  @Mutation(() => PortfolioEntity)
  async createPortfolio(@Arg('name') name: string, @Arg('url') url: string): Promise<PortfolioEntity> {
    const newPortfolio = await this.portfolioService.createPortfolio(name, url);
    return newPortfolio;
  }

  @Query(() => [PortfolioEntity], { description: 'List all portfolios' })
  async getAllPortfolios(): Promise<PortfolioEntity[]> {
    const portfolios = await this.portfolioService.getAllPortfolios();
    return portfolios;
  }
}
