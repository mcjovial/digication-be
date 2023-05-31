import PortfolioEntity from "../../src/entities/portfolio.entity";
import {
  PortfolioVersionEntity,
  VersionType,
} from "../../src/entities/portfolioVersion.entity";
import { PortfolioService } from "../../src/services/portfolio.service";
import { mockPortfolioRepo, mockPortfolioVersionRepo } from "./mockedRepos";

describe("PortfolioService", () => {
  let service: PortfolioService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PortfolioService(mockPortfolioRepo, mockPortfolioVersionRepo);
  });

  describe("createPortfolio", () => {
    it("should throw an error if the portfolio already exists", async () => {
      mockPortfolioRepo.findOne.mockResolvedValueOnce(new PortfolioEntity());
      await expect(
        service.createPortfolio("Portfolio 1", "url")
      ).rejects.toThrow("Portfolio already exists");
    });

    it("should create a new portfolio", async () => {
      const newPortfolio = new PortfolioEntity();
      newPortfolio.name = "Portfolio 1";
      newPortfolio.url = "url";

      const newPortfolioVersion = new PortfolioVersionEntity();
      newPortfolioVersion.versionType = VersionType.DRAFT;
      newPortfolioVersion.portfolio = newPortfolio;

      mockPortfolioRepo.findOne.mockResolvedValueOnce(undefined);
      mockPortfolioRepo.create.mockReturnValueOnce(newPortfolio);
      mockPortfolioRepo.save.mockResolvedValueOnce(newPortfolio);
      mockPortfolioVersionRepo.create.mockReturnValueOnce(newPortfolioVersion);
      mockPortfolioVersionRepo.save.mockResolvedValueOnce(newPortfolioVersion);

      const result = await service.createPortfolio("Portfolio 1", "url");
      expect(result).toEqual(newPortfolio);
    });
  });
});
