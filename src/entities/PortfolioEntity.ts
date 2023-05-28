import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import PageEntity from './PageEntity';
import { PortfolioVersionEntity } from './PortfolioVersionEntity';

@ObjectType('Portfolio')
@Entity()
export default class PortfolioEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('varchar', { nullable: false })
  name: string;

  @Field()
  @Column('varchar', { nullable: false, unique: true })
  url: string;

  @OneToMany(() => PageEntity, (page: PageEntity) => page.portfolio)
  pages: PageEntity[];

  @OneToMany(() => PortfolioVersionEntity, (version: PortfolioVersionEntity) => version.portfolio)
  versions: PortfolioVersionEntity[]
}
