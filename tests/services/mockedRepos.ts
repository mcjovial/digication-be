import { IPortfolioRepository } from '../../src/repositories/interfaces/IPortfolioRepository';
import { IPortfolioVersionRepository } from '../../src/repositories/interfaces/IPortfolioVersionRepository';
import { IPageRepository } from '../../src/repositories/interfaces/IPageRepository';

export const mockPortfolioRepo: jest.Mocked<IPortfolioRepository> = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn(),
};

export const mockPortfolioVersionRepo: jest.Mocked<IPortfolioVersionRepository> = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findAll: jest.fn(),
};

export const mockPageRepo: jest.Mocked<IPageRepository> = {
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};
