import { execute, GraphQLSchema, subscribe } from 'graphql';
import http from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { JwtVerifiedUser, verifyAccessToken } from '../utils/jwt-auth';

// 리졸버에서 context의 타입을 접근할 수 있도록 MySubscriptionContext를 구성하여 내보낸다.
export interface MySubscriptionContext {
  verifiedUser: JwtVerifiedUser | null;
}

export const createSubscriptionServer = async (
  schema: GraphQLSchema,
  server: http.Server,
): Promise<SubscriptionServer> => {
  return SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      // SubscriptionServer.create 함수의 onConnect 필드인 콜백 함수에서 connectionParams를 전달받을 수 있다.
      // 이 파라미터는 WebSoketLink에서 전송한 connectionParams값이 전송되므로 해당 값에서 액세스 토큰을 추출하도록 한다.
      onConnect: (connectionParams: any) => {
        console.log('connected');
        // console.log('Connection Params:', JSON.stringify(connectionParams, null, 2));
        console.log('Received connectionParams:', connectionParams); // connectionParams 출력
        if (!connectionParams.Authorization) {
          throw new Error('Authorization header is missing.');
        }

        // 반환값이 SubscriptionFilter의 context로 전달된다.
        const accessToken = connectionParams.Authorization.split(' ')[1];
        // 이후 추출된 액세스 토큰으로 유저 정보를 담은 객체를 반환하도록 구성
        // onConnect의 반환값은 리졸버의 Subscription 메소드에서 context로 접근할 수 있게 된다.
        return { verifiedUser: verifyAccessToken(accessToken) };
      },
      onDisconnect: () => {
        console.log('disconnected');
      },
    },
    { server, path: '/graphql' },
  );
};
