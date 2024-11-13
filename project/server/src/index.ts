import 'reflect-metadata';
import express from 'express';
import http from 'http';
import { createDB } from './db/db-client';
import createApolloServer from './apollo/createApolloServer';
import cookieParser from 'cookie-parser';
import { graphqlUploadExpress } from 'graphql-upload';

async function main() {
  await createDB();
  const app = express();
  app.use(express.static('public'));
  app.use(cookieParser());
  app.use(graphqlUploadExpress({ maxFieldSize: 1024 * 1000 * 5, maxFiles: 1 }));

  const apolloServer = await createApolloServer();
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: {
      // 아폴로 스튜디오를 GraphQL 테스트 용도로 활용하기 위해 https://studio.apollographql.com도 허용하도록 구성
      origin: ['http://localhost:3000', 'https://studio.apollographql.com'],
      credentials: true,
    },
  });

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
}

main().catch((err) => console.error(err));
