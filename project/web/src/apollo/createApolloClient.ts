import { ApolloClient, from, HttpLink, NormalizedCacheObject } from '@apollo/client';
import { createApolloCache } from './createApolloCache';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

// Apollo 링크 - onError 링크
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
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
const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' });

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

export const createApolloClient = (): ApolloClient<NormalizedCacheObject> =>
  new ApolloClient({
    // uri 옵션을 입력하는 경우 HttpLink를 자동적으로 처리
    // link 옵션을 입력하면, 기본적으로 처리되는 HttpLink가 비활성화되므로 HttpLink를 구성하여 link 목록에 추가하여야 한다.
    cache: createApolloCache(),
    uri: 'http://localhost:4000/graphql', // httpLink에 의해 무시됨
    // @apollo/client의 from 함수로 errorLink와 httpLink를 엮어 작성
    link: from([authLink, errorLink, httpLink]),
    // 기본적인 링크 설정 완료
  });
