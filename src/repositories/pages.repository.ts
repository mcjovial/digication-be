import { EntityRepository, Repository } from "typeorm";
import PageEntity from "../entities/PageEntity";

@EntityRepository(PageEntity)
export class PageRepository extends Repository<PageEntity> {
  
}