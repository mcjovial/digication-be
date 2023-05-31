import { Field, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";

import PageEntity from "./page.entity";
import { PortfolioVersionEntity } from "./portfolioVersion.entity";

@ObjectType("Portfolio")
@Entity()
export default class PortfolioEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("varchar", { nullable: false })
  name: string;

  @Field()
  @Column("varchar", { nullable: false, unique: true })
  url: string;

  @Field(() => [PageEntity])
  @OneToMany(() => PageEntity, (page: PageEntity) => page.portfolio)
  pages: PageEntity[];

  @Field(() => [PortfolioVersionEntity])
  @OneToMany(
    () => PortfolioVersionEntity,
    (version: PortfolioVersionEntity) => version.portfolio
  )
  versions: PortfolioVersionEntity[];
}