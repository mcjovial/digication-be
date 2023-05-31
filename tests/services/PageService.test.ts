import { PageService } from "../../src/services/page.service";
import PortfolioEntity from "../../src/entities/portfolio.entity";
import {
  PortfolioVersionEntity,
  VersionType,
} from "../../src/entities/portfolioVersion.entity";
import PageEntity from "../../src/entities/page.entity";
import {
  mockPageRepo,
  mockPortfolioRepo,
  mockPortfolioVersionRepo,
} from "./mockedRepos";

describe("PageService", () => {
  let service: PageService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PageService(
      mockPortfolioRepo,
      mockPortfolioVersionRepo,
      mockPageRepo
    );
  });

  describe("createPage", () => {
    it("should throw an error if the portfolio is not found", async () => {
      mockPortfolioRepo.findOne.mockResolvedValueOnce(undefined);
      await expect(service.createPage("Page 1", "url", 1)).rejects.toThrow(
        "Portfolio not found"
      );
    });

    it("should throw an error if the page already exists", async () => {
      const portfolio = new PortfolioEntity();
      mockPortfolioRepo.findOne.mockResolvedValueOnce(portfolio);
      mockPageRepo.findOne.mockResolvedValueOnce(new PageEntity());
      await expect(service.createPage("Page 1", "url", 1)).rejects.toThrow(
        "Page already exists"
      );
    });

    it("should throw an error if the draft version already has 3 pages", async () => {
      const portfolio = new PortfolioEntity();
      const draftVersion = new PortfolioVersionEntity();
      draftVersion.versionType = VersionType.DRAFT;
      const pages = [new PageEntity(), new PageEntity(), new PageEntity()];

      mockPortfolioRepo.findOne.mockResolvedValueOnce(portfolio);
      mockPageRepo.findOne.mockResolvedValueOnce(undefined);
      mockPortfolioVersionRepo.findOne.mockResolvedValueOnce(draftVersion);
      mockPageRepo.find.mockResolvedValueOnce(pages);

      await expect(service.createPage("Page 1", "url", 1)).rejects.toThrow(
        "Draft version already has 3 pages"
      );
    });

    it("should create a new page", async () => {
      const portfolio = new PortfolioEntity();
      const draftVersion = new PortfolioVersionEntity();
      draftVersion.versionType = VersionType.DRAFT;
      const newPage = new PageEntity();
      newPage.name = "Page 1";
      newPage.url = "url";

      mockPortfolioRepo.findOne.mockResolvedValueOnce(portfolio);
      mockPageRepo.findOne.mockResolvedValueOnce(undefined);
      mockPortfolioVersionRepo.findOne.mockResolvedValueOnce(draftVersion);
      mockPageRepo.find.mockResolvedValueOnce([]);
      mockPageRepo.create.mockReturnValueOnce(newPage);
      mockPageRepo.save.mockResolvedValueOnce(newPage);

      const result = await service.createPage("Page 1", "url", 1);
      expect(result).toEqual(newPage);
    });
  });

  describe("getAllPagesForAPortfolioVersion", () => {
    it("should throw an error if the portfolio is not found", async () => {
      mockPortfolioVersionRepo.findOne.mockResolvedValueOnce(undefined);
      await expect(service.getAllPagesForAPortfolioVersion(1)).rejects.toThrow(
        "Portfolio not found"
      );
    });
  });
});
