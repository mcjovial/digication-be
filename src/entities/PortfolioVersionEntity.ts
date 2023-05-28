import { Field, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import PortfolioEntity from "./PortfolioEntity";
import PageEntity from "./PageEntity";

export enum VersionType {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
  SNAPSHOT = 'Snapshot',
}


ObjectType('PortfolioVersion')
@Entity()
export class PortfolioVersionEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'enum', enum: VersionType, default: VersionType.DRAFT })
  versionType: VersionType;

  @ManyToOne(() => PortfolioEntity)
  portfolio: PortfolioEntity;

  @OneToMany(() => PageEntity, (page: PageEntity) => page.portfolioVersion)
  pages: PageEntity[];
}