import 'reflect-metadata';
import express from 'express';
import http from 'http';
import { createDB } from './db/db-client';
import createApolloServer from './apollo/createApolloServer';

async function main() {
  const app = express();

  const apolloServer = await createApolloServer();
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.get('/', (req, res) => {
    res.status(200).send(); // for health check
  });

  const httpServer = http.createServer(app);

  httpServer.listen(process.env.PORT || 4000, () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`
            server started on => http://localhost:4000
            graphql playground => http://localhost:4000/graphql
            `);
    } else {
      console.log(`
            Production server Started...
            `);
    }
  });

  await createDB();
}

main().catch((err) => console.error(err));
