import PageEntity from "../../src/entities/page.entity";
import PortfolioEntity from "../../src/entities/portfolio.entity";
import {
  PortfolioVersionEntity,
  VersionType,
} from "../../src/entities/portfolioVersion.entity";
import { PortfolioVersionService } from "../../src/services/portfolioVersion.service";
import {
  mockPageRepo,
  mockPortfolioRepo,
  mockPortfolioVersionRepo,
} from "./mockedRepos";

describe("PortfolioVersionService", () => {
  let service: PortfolioVersionService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PortfolioVersionService(
      mockPortfolioRepo,
      mockPortfolioVersionRepo,
      mockPageRepo
    );
  });

  describe("createSnapshotFromDraft", () => {
    it("should throw an error if too many pages are provided", async () => {
      await expect(
        service.createSnapshotFromDraft(1, [1, 2, 3, 4, 5, 6])
      ).rejects.toThrow("Too many pages, limit is 5");
    });

    it("should throw an error if the portfolio is not found", async () => {
      mockPortfolioRepo.findOne.mockResolvedValueOnce(undefined);
      await expect(
        service.createSnapshotFromDraft(1, [1, 2, 3])
      ).rejects.toThrow("Portfolio not found");
    });

    it("should create a snapshot from a draft", async () => {
      const portfolio = new PortfolioEntity();
      const draftVersion = new PortfolioVersionEntity();
      draftVersion.versionType = VersionType.DRAFT;
      draftVersion.portfolio = portfolio;

      const pages = [new PageEntity(), new PageEntity(), new PageEntity()];

      const pagesId = pages.map((page) => page.id);

      mockPortfolioRepo.findOne.mockResolvedValueOnce(portfolio);
      mockPortfolioVersionRepo.findOne.mockResolvedValueOnce(draftVersion);
      mockPageRepo.find.mockResolvedValueOnce(pages);

      const portfolioVersion = new PortfolioVersionEntity();
      portfolioVersion.versionType = VersionType.SNAPSHOT;
      portfolioVersion.portfolio = portfolio;

      mockPortfolioVersionRepo.create.mockReturnValueOnce(portfolioVersion);
      mockPortfolioVersionRepo.save.mockResolvedValueOnce(portfolioVersion);

      const result = await service.createSnapshotFromDraft(1, pagesId);
      
      expect(result).toEqual(portfolioVersion);
    });
  });

  describe("createSnapshotPortfolioVersion", () => {
    it("should throw an error if the portfolio is not found", async () => {
      mockPortfolioRepo.findOne.mockResolvedValueOnce(undefined);
      await expect(service.createSnapshotPortfolioVersion(1)).rejects.toThrow(
        "Portfolio not found"
      );
    });

    it("should create a new snapshot portfolio version", async () => {
      const portfolio = new PortfolioEntity();
      const portfolioVersion = new PortfolioVersionEntity();
      portfolioVersion.versionType = VersionType.SNAPSHOT;
      portfolioVersion.portfolio = portfolio;

      mockPortfolioRepo.findOne.mockResolvedValueOnce(portfolio);
      mockPortfolioVersionRepo.save.mockResolvedValueOnce(portfolioVersion);

      const result = await service.createSnapshotPortfolioVersion(1);

      expect(result).toEqual(portfolioVersion);
    });
  });
});
