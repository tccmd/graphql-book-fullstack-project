import { ApolloClient, from, fromPromise, NormalizedCacheObject, split } from '@apollo/client';
import { createApolloCache } from './createApolloCache';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { refreshAccessToken } from './auth';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
let apolloClient: ApolloClient<NormalizedCacheObject>;

export const initializeApolloClient = () => {
  if (!apolloClient) {
    apolloClient = createApolloClient();
  }
  return apolloClient;
};

// Apollo 링크 - onError 링크 (에러 처리)
// 에러 감지 및 처리 (GraphQL에러와 네트워크 에러를 모두 감지하고 처리할 수 있다.)
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    // 토큰이 만료된 경우에만 refreshAccessToken 뮤테이션을 실행
    // project/server/src/utils/jwt-auth.ts - verifyAccessToken()
    if (graphQLErrors.find((err) => err.message === 'access token expired')) {
      // onError 링크의 콜백 함수로는 async 함수를 사용하지 못한다.
      // 이를 위해 Apollo에서는 fromPromise 함수를 제공
      // fromPromise 함수는 Promise 또는 async 함수를 Observable로 변환시켜준다.
      const client = initializeApolloClient(); // 클라이언트 초기화
      return (
        fromPromise(refreshAccessToken(client, operation))
          // .filter((result) => !!result)를 통해 토큰이 재발급된 경우에만
          // !!result는 result가 있는지 없는지 확인하기 위해 사용됨
          // resultrk null이나 undefined가 아닌 유효한 값이라면 true 반환
          .filter((result) => !!result)
          // 기존 요청을 계속 진행해 다음 링크로 요청을 이어주는 함수
          // flatMap() - 각 배열 요소에 대해 함수를 적용하여 그 결과를 한 배열로(배열 중첩x) 평탄화(flatten)하는 메서드
          // Observable에서는 비동기 흐름을 다루기 위해 사용됐다.
          .flatMap(() => forward(operation))
      );
    }

    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: -> ${operation.operationName}
        Message: ${message}, Query: ${path}, Location: ${JSON.stringify(locations)}
        `,
      );
    });
  }
  if (networkError) {
    console.log(`[networkError]: -> ${operation.operationName}
      Message: ${networkError.message}
      `);
  }
});

// Apollo 링크 - HttpLink: HTTP 통신을 통해 각 GraphQL 요청을 서버로 보내기 위한 노드
// const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql', credentials: 'include' });
const httpUploadLink = createUploadLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
});

// Apollo 링크 - 헤더로 엑세스 토큰을 지정해주는 작업을 실행하는 링크
const authLink = setContext((req, prevContext) => {
  const accessToken = localStorage.getItem('access_token');
  return {
    headers: {
      ...prevContext.headers,
      // JWT를 통한 인증을 진행하는 경우에는 Bearer 타입을 사용한다.
      // eslint-disable-next-line no-template-curly-in-string
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  };
});

// WebSocket 링크
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {
    // reconnect 필드로 웹소켓 커넥션이 끊길 경우를 대비해 재연결하도록 구성
    reconnect: true,
    // 액세스 토큰을 갓으로 하는 Authorization 필드를 가진 객체를 반환하는 connectionParams 함수를 구성
    // 이 반환 객체는 서버로 전달되어, 현재 연결된 커넥션에 대한 문맥 정보를 확인할 수 있도록 한다.
    connectionParams: () => {
      const accessToken = localStorage.getItem('access_token');
      return {
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      };
    },
  },
});

// split 링크
// Subscription 요청만 wsLink를 통해 Subscription 서버로 요청하고, 쿼리와 뮤테이션은 기본 서버로 요청하려는 경우,
// @apollo/client 패키지에서 spilt 유틸 함수를 가져와 쿼리 정보를 바탕으로 operation이 "subscription"인 경우에만 wsLink에서 처리하도록 구성
// spilt의 첫 번째 인자는 boolean을 반환하는 함수, true일 경우 두 번째 인자로 입력한 링크가, false인 경우 세 번째 인자로 입력한 링크가 적용된다.
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  from([wsLink]),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  from([authLink, errorLink, httpUploadLink as any]),
);

export const createApolloClient = (): ApolloClient<NormalizedCacheObject> =>
  new ApolloClient({
    // uri 옵션을 입력하는 경우 HttpLink를 자동적으로 처리
    // link 옵션을 입력하면, 기본적으로 처리되는 HttpLink가 비활성화되므로 HttpLink를 구성하여 link 목록에 추가하여야 한다.
    cache: createApolloCache(),
    uri: 'http://localhost:4000/graphql', // httpLink에 의해 무시됨
    // @apollo/client의 from 함수로 errorLink와 httpLink를 엮어 작성
    // uploadLink는 httpLink와 동일하게 링크 체인을 끝내는 링크. 링크 배열의 마지막에 위치해야 한다.
    // split 함수의 반환값을 ApolloClient()의 link 필드로 적용하여 WebSocket을 통해 Subscription 요청이 이루어질 수 있도록 구성
    link: splitLink,
    // 기본적인 링크 설정 완료
  });
