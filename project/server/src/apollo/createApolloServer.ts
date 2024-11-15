import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { Request, Response } from 'express';
import { JwtVerifiedUser, verifyAccessTokenFromReqHeaders } from '../utils/jwt-auth';
import redis from '../redis/redis-client';
import { createCutVoteLoader } from '../dataloader/cutVoteLoader';
import { GraphQLSchema } from 'graphql';

export interface MyContext {
  req: Request;
  res: Response;
  verifiedUser: JwtVerifiedUser;
  redis: typeof redis;
  // cutVoteLoader 필드 추가, ReturnType이라는 유틸리티 타입을 사용해 cutVoteLoader의 반환값을 갖도록 구성
  cutVoteLoader: ReturnType<typeof createCutVoteLoader>;
}

const createApolloServer = async (schema: GraphQLSchema): Promise<ApolloServer> => {
  return new ApolloServer<MyContext>({
    schema,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
    // context 객체에 verifiedUser라는 필드로 액세스 토큰을 통한 유저 검증 정보를 넘기도록 구성
    context: ({ req, res }) => {
      // 액세스 토큰 검증
      const verified = verifyAccessTokenFromReqHeaders(req.headers);
      return { req, res, verifiedUser: verified, redis, cutVoteLoader: createCutVoteLoader() };
    },
  });
};

export default createApolloServer;
