import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import PortfolioEntity from "./portfolio.entity";
import { PortfolioVersionEntity } from "./portfolioVersion.entity";

@ObjectType("Page")
@Entity()
export default class PageEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("varchar", { nullable: false })
  name: string;

  @Field()
  @Column("varchar", { nullable: false, unique: true })
  url: string;

  @Field(() => PortfolioEntity)
  @ManyToOne(() => PortfolioEntity, { nullable: false })
  portfolio: PortfolioEntity;

  @Field(() => PortfolioVersionEntity)
  @ManyToOne(
    () => PortfolioVersionEntity,
    (portfolioVersion: PortfolioVersionEntity) => portfolioVersion.pages
  )
  portfolioVersion: PortfolioVersionEntity;
}
