import ConfigInterface from './ConfigInterface';

const config: ConfigInterface = {
  env: 'development',
  database: {
    type: 'postgres' as const,
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: ['src/entities/*.ts'],
    logger: 'advanced-console' as const,
    logging: true,
    synchronize: true,
  },
  graphQLPath: '/graphql',
  resolvers: [`${__dirname}/../resolvers/**/*Resolver.ts`],
};

export default config;
