import {
  AspectRatio, // 가로 세로 비율을 맞춰주는 컴포넌트
  Box, // 레이아웃을 잡는 기본 컨테이너
  Heading, // 제목을 표시하는 컴포넌트
  Image, // 이미지 컴포넌트
  LinkBox,
  LinkOverlay, // 클릭 가능한 박스를 만들기 위한 컴포넌트
  Stack, // 요소들을 수직으로 쌓는 레이아웃 컴포넌트
  Text, // 텍스트를 표시하는 컴포넌트
  useColorModeValue, // 다크 모드와 라이트 모드에 따라 색상을 변경할 때 사용
} from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

// UserReviewCard 컴포넌트의 Props 인터페이스 정의
interface UserReviewCardProps {
  userCutReview: {
    cutId: number;
    contents: string;
    createdAt: string;
  };
}

export default function UserCutReviewCard({ userCutReview }: UserReviewCardProps): React.ReactElement {
  return (
    // LinkBox는 클릭 가능한 아티클을 만드는 컴포넌트로 사용
    <LinkBox as="article" my={6}>
      <Box
        maxW="300px" // 카드의 최대 너비를 300px로 설정
        w="full" // 너비를 가득 채움
        rounded="md" // 모서리를 둥글게 처리
        px={{ base: 1, md: 3 }} // 화면 크기에 따라 패딩을 조정 (작을 때는 1, 클 때는 3)
        pt={3} // 위쪽 패딩 설정
        overflow="hidden" // 내부 콘텐츠가 넘칠 경우 숨김 처리
      >
        {userCutReview?.contents} | {userCutReview.createdAt}
      </Box>
    </LinkBox>
  );
}
