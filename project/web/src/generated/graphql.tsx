/* eslint-disable */
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Upload: { input: any; output: any; }
};

export type CreateOrUpdateCutReviewInput = {
  /** 감상평 내용 */
  contents: Scalars['String']['input'];
  /** 명장면 번호 */
  cutId: Scalars['Int']['input'];
};

export type Cut = {
  __typename?: 'Cut';
  film?: Maybe<Film>;
  /** 영화 아이디 */
  filmId: Scalars['Int']['output'];
  /** 명장면 고유 아이디 */
  id: Scalars['Int']['output'];
  isVoted: Scalars['Boolean']['output'];
  /** 명장면 사진 주소 */
  src: Scalars['String']['output'];
  votesCount: Scalars['Int']['output'];
};

export type CutReview = {
  __typename?: 'CutReview';
  /** 감상평 내용 */
  contents: Scalars['String']['output'];
  /** 생성 일자 */
  createdAt: Scalars['String']['output'];
  /** 명장면 번호 */
  cutId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  isMine: Scalars['Boolean']['output'];
  /** 수정 일자 */
  updatedAt: Scalars['String']['output'];
  user: User;
};

export type Director = {
  __typename?: 'Director';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

/** 필드 에러 타입 */
export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type Film = {
  __typename?: 'Film';
  /** 영화 줄거리 및 설명 */
  description: Scalars['String']['output'];
  director: Director;
  /** 제작자 고유 아이디 */
  director_id: Scalars['Int']['output'];
  /** 영화 장르 */
  genre: Scalars['String']['output'];
  /** 영화 고유 아이디 */
  id: Scalars['Int']['output'];
  /** 포스터 이미지 URL */
  posterImg: Scalars['String']['output'];
  /** 개봉일 */
  release: Scalars['String']['output'];
  /** 영화 러닝 타임, minute */
  runningTime: Scalars['Float']['output'];
  /** 영화 부제목 */
  subtitle?: Maybe<Scalars['String']['output']>;
  /** 영화 제목 */
  title: Scalars['String']['output'];
};

/** 로그인 인풋 데이터 */
export type LoginInput = {
  emailOrUsername: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

/** 로그인 반환 데이터 */
export type LoginResponse = {
  __typename?: 'LoginResponse';
  accessToken?: Maybe<Scalars['String']['output']>;
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createNotification: Notification;
  createOrUpdateCutReview?: Maybe<CutReview>;
  deleteReview: Scalars['Boolean']['output'];
  login: LoginResponse;
  logout: Scalars['Boolean']['output'];
  refreshAccessToken?: Maybe<RefreshAccessTokenResponse>;
  signUp: User;
  uploadProfileImage: Scalars['Boolean']['output'];
  vote: Scalars['Boolean']['output'];
};


export type MutationCreateNotificationArgs = {
  text: Scalars['String']['input'];
  userId: Scalars['Int']['input'];
};


export type MutationCreateOrUpdateCutReviewArgs = {
  cutReviewInput: CreateOrUpdateCutReviewInput;
};


export type MutationDeleteReviewArgs = {
  id: Scalars['Int']['input'];
};


export type MutationLoginArgs = {
  loginInput: LoginInput;
};


export type MutationSignUpArgs = {
  signUpInput: SignUpInput;
};


export type MutationUploadProfileImageArgs = {
  file: Scalars['Upload']['input'];
};


export type MutationVoteArgs = {
  cutId: Scalars['Int']['input'];
};

export type Notification = {
  __typename?: 'Notification';
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  text: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  userId: Scalars['Float']['output'];
};

export type PaginatedFilms = {
  __typename?: 'PaginatedFilms';
  cursor?: Maybe<Scalars['Int']['output']>;
  films: Array<Film>;
};

export type Query = {
  __typename?: 'Query';
  cut?: Maybe<Cut>;
  cutReviews: Array<CutReview>;
  cuts: Array<Cut>;
  film?: Maybe<Film>;
  films: PaginatedFilms;
  me?: Maybe<User>;
  /** 세션에 해당되는 유저의 모든 알림을 가져온다. */
  notifications: Array<Notification>;
};


export type QueryCutArgs = {
  cutId: Scalars['Int']['input'];
};


export type QueryCutReviewsArgs = {
  cutId?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCutsArgs = {
  filmId: Scalars['Int']['input'];
};


export type QueryFilmArgs = {
  filmId: Scalars['Int']['input'];
};


export type QueryFilmsArgs = {
  cursor?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

/** 액세스 토큰 새로고침 반환 데이터 */
export type RefreshAccessTokenResponse = {
  __typename?: 'RefreshAccessTokenResponse';
  accessToken: Scalars['String']['output'];
};

export type SignUpInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  newNotification: Notification;
};

export type User = {
  __typename?: 'User';
  /** 생성 일자 */
  createdAt: Scalars['String']['output'];
  /** 유저 이메일  */
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  /** 프로필 사진 경로 */
  profileImage?: Maybe<Scalars['String']['output']>;
  /** 업데이트 일자 */
  updatedAt: Scalars['String']['output'];
  userCutReviews?: Maybe<Array<CutReview>>;
  /** 유저 이름 */
  username: Scalars['String']['output'];
};


export type UserUserCutReviewsArgs = {
  cutId?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateOrUpdateCutReviewMutationVariables = Exact<{
  cutReviewInput: CreateOrUpdateCutReviewInput;
}>;


export type CreateOrUpdateCutReviewMutation = { __typename?: 'Mutation', createOrUpdateCutReview?: { __typename?: 'CutReview', contents: string, cutId: number, id: number, createdAt: string, isMine: boolean, user: { __typename?: 'User', username: string, email: string } } | null };

export type DeleteCutReviewMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteCutReviewMutation = { __typename?: 'Mutation', deleteReview: boolean };

export type LoginMutationVariables = Exact<{
  loginInput: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', accessToken?: string | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RefreshAccessTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshAccessTokenMutation = { __typename?: 'Mutation', refreshAccessToken?: { __typename?: 'RefreshAccessTokenResponse', accessToken: string } | null };

export type SignUpMutationVariables = Exact<{
  signUpInput: SignUpInput;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: { __typename?: 'User', email: string, username: string, createdAt: string, updatedAt: string } };

export type UploadProfileImageMutationVariables = Exact<{
  file: Scalars['Upload']['input'];
}>;


export type UploadProfileImageMutation = { __typename?: 'Mutation', uploadProfileImage: boolean };

export type VoteMutationVariables = Exact<{
  cutId: Scalars['Int']['input'];
}>;


export type VoteMutation = { __typename?: 'Mutation', vote: boolean };

export type CutQueryVariables = Exact<{
  cutId: Scalars['Int']['input'];
}>;


export type CutQuery = { __typename?: 'Query', cut?: { __typename?: 'Cut', id: number, src: string, votesCount: number, isVoted: boolean, film?: { __typename?: 'Film', id: number, title: string } | null } | null, cutReviews: Array<{ __typename?: 'CutReview', id: number, contents: string, isMine: boolean, user: { __typename?: 'User', username: string, email: string } }> };

export type CutsQueryVariables = Exact<{
  filmId: Scalars['Int']['input'];
}>;


export type CutsQuery = { __typename?: 'Query', cuts: Array<{ __typename?: 'Cut', id: number, src: string }> };

export type FilmQueryVariables = Exact<{
  filmId: Scalars['Int']['input'];
}>;


export type FilmQuery = { __typename?: 'Query', film?: { __typename?: 'Film', id: number, title: string, subtitle?: string | null, description: string, genre: string, runningTime: number, posterImg: string, release: string, director: { __typename?: 'Director', id: number, name: string } } | null };

export type FilmsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  cursor?: InputMaybe<Scalars['Int']['input']>;
}>;


export type FilmsQuery = { __typename?: 'Query', films: { __typename?: 'PaginatedFilms', cursor?: number | null, films: Array<{ __typename?: 'Film', id: number, title: string, subtitle?: string | null, runningTime: number, release: string, posterImg: string, director: { __typename?: 'Director', name: string } }> } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, username: string, email: string, updatedAt: string, createdAt: string, profileImage?: string | null } | null };

export type NotificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type NotificationsQuery = { __typename?: 'Query', notifications: Array<{ __typename?: 'Notification', id: number, userId: number, text: string, createdAt: string, updatedAt: string }> };

export type NewNotificationSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NewNotificationSubscription = { __typename?: 'Subscription', newNotification: { __typename?: 'Notification', id: number, userId: number, text: string, createdAt: string, updatedAt: string } };


export const CreateOrUpdateCutReviewDocument = gql`
    mutation createOrUpdateCutReview($cutReviewInput: CreateOrUpdateCutReviewInput!) {
  createOrUpdateCutReview(cutReviewInput: $cutReviewInput) {
    contents
    cutId
    id
    user {
      username
      email
    }
    createdAt
    isMine
  }
}
    `;
export type CreateOrUpdateCutReviewMutationFn = Apollo.MutationFunction<CreateOrUpdateCutReviewMutation, CreateOrUpdateCutReviewMutationVariables>;

/**
 * __useCreateOrUpdateCutReviewMutation__
 *
 * To run a mutation, you first call `useCreateOrUpdateCutReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrUpdateCutReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrUpdateCutReviewMutation, { data, loading, error }] = useCreateOrUpdateCutReviewMutation({
 *   variables: {
 *      cutReviewInput: // value for 'cutReviewInput'
 *   },
 * });
 */
export function useCreateOrUpdateCutReviewMutation(baseOptions?: Apollo.MutationHookOptions<CreateOrUpdateCutReviewMutation, CreateOrUpdateCutReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateOrUpdateCutReviewMutation, CreateOrUpdateCutReviewMutationVariables>(CreateOrUpdateCutReviewDocument, options);
      }
export type CreateOrUpdateCutReviewMutationHookResult = ReturnType<typeof useCreateOrUpdateCutReviewMutation>;
export type CreateOrUpdateCutReviewMutationResult = Apollo.MutationResult<CreateOrUpdateCutReviewMutation>;
export type CreateOrUpdateCutReviewMutationOptions = Apollo.BaseMutationOptions<CreateOrUpdateCutReviewMutation, CreateOrUpdateCutReviewMutationVariables>;
export const DeleteCutReviewDocument = gql`
    mutation deleteCutReview($id: Int!) {
  deleteReview(id: $id)
}
    `;
export type DeleteCutReviewMutationFn = Apollo.MutationFunction<DeleteCutReviewMutation, DeleteCutReviewMutationVariables>;

/**
 * __useDeleteCutReviewMutation__
 *
 * To run a mutation, you first call `useDeleteCutReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCutReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCutReviewMutation, { data, loading, error }] = useDeleteCutReviewMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCutReviewMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCutReviewMutation, DeleteCutReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCutReviewMutation, DeleteCutReviewMutationVariables>(DeleteCutReviewDocument, options);
      }
export type DeleteCutReviewMutationHookResult = ReturnType<typeof useDeleteCutReviewMutation>;
export type DeleteCutReviewMutationResult = Apollo.MutationResult<DeleteCutReviewMutation>;
export type DeleteCutReviewMutationOptions = Apollo.BaseMutationOptions<DeleteCutReviewMutation, DeleteCutReviewMutationVariables>;
export const LoginDocument = gql`
    mutation login($loginInput: LoginInput!) {
  login(loginInput: $loginInput) {
    errors {
      field
      message
    }
    user {
      id
      username
      email
    }
    accessToken
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      loginInput: // value for 'loginInput'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RefreshAccessTokenDocument = gql`
    mutation refreshAccessToken {
  refreshAccessToken {
    accessToken
  }
}
    `;
export type RefreshAccessTokenMutationFn = Apollo.MutationFunction<RefreshAccessTokenMutation, RefreshAccessTokenMutationVariables>;

/**
 * __useRefreshAccessTokenMutation__
 *
 * To run a mutation, you first call `useRefreshAccessTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshAccessTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshAccessTokenMutation, { data, loading, error }] = useRefreshAccessTokenMutation({
 *   variables: {
 *   },
 * });
 */
export function useRefreshAccessTokenMutation(baseOptions?: Apollo.MutationHookOptions<RefreshAccessTokenMutation, RefreshAccessTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RefreshAccessTokenMutation, RefreshAccessTokenMutationVariables>(RefreshAccessTokenDocument, options);
      }
export type RefreshAccessTokenMutationHookResult = ReturnType<typeof useRefreshAccessTokenMutation>;
export type RefreshAccessTokenMutationResult = Apollo.MutationResult<RefreshAccessTokenMutation>;
export type RefreshAccessTokenMutationOptions = Apollo.BaseMutationOptions<RefreshAccessTokenMutation, RefreshAccessTokenMutationVariables>;
export const SignUpDocument = gql`
    mutation signUp($signUpInput: SignUpInput!) {
  signUp(signUpInput: $signUpInput) {
    email
    username
    createdAt
    updatedAt
  }
}
    `;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      signUpInput: // value for 'signUpInput'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const UploadProfileImageDocument = gql`
    mutation uploadProfileImage($file: Upload!) {
  uploadProfileImage(file: $file)
}
    `;
export type UploadProfileImageMutationFn = Apollo.MutationFunction<UploadProfileImageMutation, UploadProfileImageMutationVariables>;

/**
 * __useUploadProfileImageMutation__
 *
 * To run a mutation, you first call `useUploadProfileImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadProfileImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadProfileImageMutation, { data, loading, error }] = useUploadProfileImageMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUploadProfileImageMutation(baseOptions?: Apollo.MutationHookOptions<UploadProfileImageMutation, UploadProfileImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadProfileImageMutation, UploadProfileImageMutationVariables>(UploadProfileImageDocument, options);
      }
export type UploadProfileImageMutationHookResult = ReturnType<typeof useUploadProfileImageMutation>;
export type UploadProfileImageMutationResult = Apollo.MutationResult<UploadProfileImageMutation>;
export type UploadProfileImageMutationOptions = Apollo.BaseMutationOptions<UploadProfileImageMutation, UploadProfileImageMutationVariables>;
export const VoteDocument = gql`
    mutation vote($cutId: Int!) {
  vote(cutId: $cutId)
}
    `;
export type VoteMutationFn = Apollo.MutationFunction<VoteMutation, VoteMutationVariables>;

/**
 * __useVoteMutation__
 *
 * To run a mutation, you first call `useVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [voteMutation, { data, loading, error }] = useVoteMutation({
 *   variables: {
 *      cutId: // value for 'cutId'
 *   },
 * });
 */
export function useVoteMutation(baseOptions?: Apollo.MutationHookOptions<VoteMutation, VoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument, options);
      }
export type VoteMutationHookResult = ReturnType<typeof useVoteMutation>;
export type VoteMutationResult = Apollo.MutationResult<VoteMutation>;
export type VoteMutationOptions = Apollo.BaseMutationOptions<VoteMutation, VoteMutationVariables>;
export const CutDocument = gql`
    query cut($cutId: Int!) {
  cut(cutId: $cutId) {
    id
    src
    film {
      id
      title
    }
    votesCount
    isVoted
  }
  cutReviews(cutId: $cutId) {
    id
    contents
    isMine
    user {
      username
      email
    }
  }
}
    `;

/**
 * __useCutQuery__
 *
 * To run a query within a React component, call `useCutQuery` and pass it any options that fit your needs.
 * When your component renders, `useCutQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCutQuery({
 *   variables: {
 *      cutId: // value for 'cutId'
 *   },
 * });
 */
export function useCutQuery(baseOptions: Apollo.QueryHookOptions<CutQuery, CutQueryVariables> & ({ variables: CutQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CutQuery, CutQueryVariables>(CutDocument, options);
      }
export function useCutLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CutQuery, CutQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CutQuery, CutQueryVariables>(CutDocument, options);
        }
export function useCutSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CutQuery, CutQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CutQuery, CutQueryVariables>(CutDocument, options);
        }
export type CutQueryHookResult = ReturnType<typeof useCutQuery>;
export type CutLazyQueryHookResult = ReturnType<typeof useCutLazyQuery>;
export type CutSuspenseQueryHookResult = ReturnType<typeof useCutSuspenseQuery>;
export type CutQueryResult = Apollo.QueryResult<CutQuery, CutQueryVariables>;
export const CutsDocument = gql`
    query cuts($filmId: Int!) {
  cuts(filmId: $filmId) {
    id
    src
  }
}
    `;

/**
 * __useCutsQuery__
 *
 * To run a query within a React component, call `useCutsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCutsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCutsQuery({
 *   variables: {
 *      filmId: // value for 'filmId'
 *   },
 * });
 */
export function useCutsQuery(baseOptions: Apollo.QueryHookOptions<CutsQuery, CutsQueryVariables> & ({ variables: CutsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CutsQuery, CutsQueryVariables>(CutsDocument, options);
      }
export function useCutsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CutsQuery, CutsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CutsQuery, CutsQueryVariables>(CutsDocument, options);
        }
export function useCutsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CutsQuery, CutsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CutsQuery, CutsQueryVariables>(CutsDocument, options);
        }
export type CutsQueryHookResult = ReturnType<typeof useCutsQuery>;
export type CutsLazyQueryHookResult = ReturnType<typeof useCutsLazyQuery>;
export type CutsSuspenseQueryHookResult = ReturnType<typeof useCutsSuspenseQuery>;
export type CutsQueryResult = Apollo.QueryResult<CutsQuery, CutsQueryVariables>;
export const FilmDocument = gql`
    query film($filmId: Int!) {
  film(filmId: $filmId) {
    id
    title
    subtitle
    description
    genre
    runningTime
    posterImg
    release
    director {
      id
      name
    }
  }
}
    `;

/**
 * __useFilmQuery__
 *
 * To run a query within a React component, call `useFilmQuery` and pass it any options that fit your needs.
 * When your component renders, `useFilmQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFilmQuery({
 *   variables: {
 *      filmId: // value for 'filmId'
 *   },
 * });
 */
export function useFilmQuery(baseOptions: Apollo.QueryHookOptions<FilmQuery, FilmQueryVariables> & ({ variables: FilmQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FilmQuery, FilmQueryVariables>(FilmDocument, options);
      }
export function useFilmLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FilmQuery, FilmQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FilmQuery, FilmQueryVariables>(FilmDocument, options);
        }
export function useFilmSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FilmQuery, FilmQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FilmQuery, FilmQueryVariables>(FilmDocument, options);
        }
export type FilmQueryHookResult = ReturnType<typeof useFilmQuery>;
export type FilmLazyQueryHookResult = ReturnType<typeof useFilmLazyQuery>;
export type FilmSuspenseQueryHookResult = ReturnType<typeof useFilmSuspenseQuery>;
export type FilmQueryResult = Apollo.QueryResult<FilmQuery, FilmQueryVariables>;
export const FilmsDocument = gql`
    query Films($limit: Int, $cursor: Int) {
  films(limit: $limit, cursor: $cursor) {
    cursor
    films {
      id
      title
      subtitle
      runningTime
      director {
        name
      }
      release
      posterImg
    }
  }
}
    `;

/**
 * __useFilmsQuery__
 *
 * To run a query within a React component, call `useFilmsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFilmsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFilmsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useFilmsQuery(baseOptions?: Apollo.QueryHookOptions<FilmsQuery, FilmsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FilmsQuery, FilmsQueryVariables>(FilmsDocument, options);
      }
export function useFilmsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FilmsQuery, FilmsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FilmsQuery, FilmsQueryVariables>(FilmsDocument, options);
        }
export function useFilmsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FilmsQuery, FilmsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FilmsQuery, FilmsQueryVariables>(FilmsDocument, options);
        }
export type FilmsQueryHookResult = ReturnType<typeof useFilmsQuery>;
export type FilmsLazyQueryHookResult = ReturnType<typeof useFilmsLazyQuery>;
export type FilmsSuspenseQueryHookResult = ReturnType<typeof useFilmsSuspenseQuery>;
export type FilmsQueryResult = Apollo.QueryResult<FilmsQuery, FilmsQueryVariables>;
export const MeDocument = gql`
    query me {
  me {
    id
    username
    email
    updatedAt
    createdAt
    profileImage
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const NotificationsDocument = gql`
    query notifications {
  notifications {
    id
    userId
    text
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useNotificationsQuery__
 *
 * To run a query within a React component, call `useNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotificationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useNotificationsQuery(baseOptions?: Apollo.QueryHookOptions<NotificationsQuery, NotificationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NotificationsQuery, NotificationsQueryVariables>(NotificationsDocument, options);
      }
export function useNotificationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NotificationsQuery, NotificationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NotificationsQuery, NotificationsQueryVariables>(NotificationsDocument, options);
        }
export function useNotificationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<NotificationsQuery, NotificationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<NotificationsQuery, NotificationsQueryVariables>(NotificationsDocument, options);
        }
export type NotificationsQueryHookResult = ReturnType<typeof useNotificationsQuery>;
export type NotificationsLazyQueryHookResult = ReturnType<typeof useNotificationsLazyQuery>;
export type NotificationsSuspenseQueryHookResult = ReturnType<typeof useNotificationsSuspenseQuery>;
export type NotificationsQueryResult = Apollo.QueryResult<NotificationsQuery, NotificationsQueryVariables>;
export const NewNotificationDocument = gql`
    subscription newNotification {
  newNotification {
    id
    userId
    text
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useNewNotificationSubscription__
 *
 * To run a query within a React component, call `useNewNotificationSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewNotificationSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewNotificationSubscription({
 *   variables: {
 *   },
 * });
 */
export function useNewNotificationSubscription(baseOptions?: Apollo.SubscriptionHookOptions<NewNotificationSubscription, NewNotificationSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewNotificationSubscription, NewNotificationSubscriptionVariables>(NewNotificationDocument, options);
      }
export type NewNotificationSubscriptionHookResult = ReturnType<typeof useNewNotificationSubscription>;
export type NewNotificationSubscriptionResult = Apollo.SubscriptionResult<NewNotificationSubscription>;