import { Field, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import PortfolioEntity from "./portfolio.entity";
import PageEntity from "./page.entity";

export enum VersionType {
  DRAFT = "Draft",
  PUBLISHED = "Published",
  SNAPSHOT = "Snapshot",
}

@ObjectType("PortfolioVersion")
@Entity()
export class PortfolioVersionEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: "enum", enum: VersionType, default: VersionType.DRAFT })
  versionType: VersionType;

  @Field(() => PortfolioEntity)
  @ManyToOne(() => PortfolioEntity, { eager: true })
  portfolio: PortfolioEntity;

  @Field(() => [PageEntity])
  @OneToMany(() => PageEntity, (page: PageEntity) => page.portfolioVersion)
  pages: PageEntity[];
}
