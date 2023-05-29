import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { PortfolioVersionEntity } from "../entities/PortfolioVersionEntity";
import { PortfolioVersionService } from "../services/portfolioVersions.service";

@Resolver(() => PortfolioVersionEntity)
@Service()
export class PortfolioVersionResolver {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly portfolioVersionService: PortfolioVersionService) {}

  @Query(() => [PortfolioVersionEntity], { description: 'Get all available portfolio versions' })
  async getAllAvailablePortfolioVersions(): Promise<PortfolioVersionEntity[]> {
    const result = await this.portfolioVersionService.getAllAvailablePortfolioVersions();
    return result;
  }

  @Mutation(() => PortfolioVersionEntity, { description: 'Create a snapshot from a draft version' })
  async createSnapshotFromDraft(
    @Arg('portfolioId') portfolioId: string,
    @Arg('pagesId', () => [String]) pagesId: string[]
  ): Promise<PortfolioVersionEntity> {
    const results = await this.portfolioVersionService.createSnapshotFromDraft(portfolioId, pagesId);
    return results;
  }

  @Mutation(() => PortfolioVersionEntity, { description: 'Create a published version for a portfolio' })
  async createPublishedPortfolioVersion(
    @Arg('portfolioId') portfolioId: string
  ): Promise<PortfolioVersionEntity> {
    const newVersion = await this.portfolioVersionService.createPublishedPortfolioVersion(portfolioId);
    return newVersion;
  }
}
