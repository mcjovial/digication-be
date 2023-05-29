import { ApolloServer, Config as ApolloServerConfig } from 'apollo-server-koa';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { createSchema } from './createSchema';

export default function createApolloServer(apolloServerConfig?: ApolloServerConfig) {
  const apolloServer = new ApolloServer({
    debug: true,
    schema: createSchema(),
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground
    ],
    ...apolloServerConfig,
  });

  return apolloServer;
}
