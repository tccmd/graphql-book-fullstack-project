import { Box, SimpleGrid, Skeleton, Text } from '@chakra-ui/react';
// import { useFilmsQuery } from '../../generated/graphql'; // GraphQL로 자동 생성된 useFilmsQuery를 가져옴
// import FilmCard from './FilmCard'; // 개별 영화 정보를 보여줄 FilmCard 컴포넌트를 가져옴
import { Waypoint } from 'react-waypoint';
import { useMeQuery } from '../../../generated/graphql';
import UserCutReviewCard from './UserCutReviewCard';

// FilmList 컴포넌트는 영화 목록을 보여줌
export default function UserCutReviewList(): JSX.Element {
  // useFilmsQuery를 호출하여 영화 데이터를 불러옴. 로딩 상태, 에러, 데이터를 반환함
  const LIMIT = 6;
  const { data, loading, error, fetchMore } = useMeQuery();

  // 에러가 발생하면 에러 메시지를 출력
  // if (error) return <p>{error.message}</p>;

  // SimpleGrid는 그리드 레이아웃을 생성, 열 수를 반응형으로 설정 (기본 2열, 큰 화면에서는 3열)
  return (
    <SimpleGrid columns={[1, null, 3]} spacing={[2, null, 5]}>
      {data?.me?.userCutReviews && data.me.userCutReviews.length > 0 ? (
        // 데이터가 있는 경우, 리뷰 카드를 렌더링
        data.me.userCutReviews.map((userCutReview, i) => <UserCutReviewCard key={i} userCutReview={userCutReview} />)
      ) : (
        // 데이터가 없거나 빈 배열인 경우 메시지 표시
        <Box textAlign="center" color="gray.500" fontSize="lg" p={4}>
          No reviews found.
        </Box>
      )}{' '}
    </SimpleGrid>
  );
}
