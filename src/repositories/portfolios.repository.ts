import { EntityRepository, Repository } from "typeorm";
import PortfolioEntity from "../entities/PortfolioEntity";

@EntityRepository(PortfolioEntity)
export class PortfolioRepository extends Repository<PortfolioEntity> { }
