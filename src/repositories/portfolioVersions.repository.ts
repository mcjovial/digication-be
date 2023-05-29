import { EntityRepository, Repository } from "typeorm";
import { PortfolioVersionEntity } from "../entities/PortfolioVersionEntity";

@EntityRepository(PortfolioVersionEntity)
export class PortfolioVersionRepository extends Repository<PortfolioVersionEntity> {}