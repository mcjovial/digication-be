import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { PortfolioVersionService } from "../services/portfolioVersion.service";
import { PortfolioVersionEntity } from "../entities/portfolioVersion.entity";

@Resolver(() => PortfolioVersionEntity)
@Service()
export class PortfolioVersionResolver {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private readonly portfolioVersionService: PortfolioVersionService
  ) {}

  @Query(() => [PortfolioVersionEntity], { description: 'Get all available portfolio versions' })
  async getAllAvailablePortfolioVersions(): Promise<PortfolioVersionEntity[]> {
    const result = await this.portfolioVersionService.getAllAvailablePortfolioVersions();
    return result;
  }
  
  @Query(() => [PortfolioVersionEntity], { description: 'Get all available versions of a portfolio' })
  async portfolioVersions(
    @Arg("portfolioId") portfolioId: number
  ): Promise<PortfolioVersionEntity[]> {
    const result = await this.portfolioVersionService.portfolioVersions(
      portfolioId
    );
    return result;
  }

  @Mutation(() => PortfolioVersionEntity, { description: 'Create a snapshot portfolio version' })
  async createSnapshotPortfolioVersion(
    @Arg("portfolioId") portfolioId: number
  ): Promise<PortfolioVersionEntity> {
    const result =
      await this.portfolioVersionService.createSnapshotPortfolioVersion(
        portfolioId
      );
    return result;
  }

  @Mutation(() => PortfolioVersionEntity, {
    description: "Create a snapshot from a draft version",
  })
  async createSnapshotFromDraft(
    @Arg("portfolioId") portfolioId: number,
    @Arg("pagesId", () => [Number]) pagesId: number[]
  ): Promise<PortfolioVersionEntity> {
    const result = await this.portfolioVersionService.createSnapshotFromDraft(
      portfolioId,
      pagesId
    );
    return result;
  }
}
