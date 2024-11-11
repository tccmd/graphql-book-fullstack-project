import { Box, Divider, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import UserCutReviewList from './UserCutReviewList';

function UserReview(): React.ReactElement {
  const onSubmit = async () => {};
  return (
    <Box rounded="lg" bg={useColorModeValue('white', 'gray.700')} boxShadow="lg" p={8}>
      <Stack as="form" spacing={4} onSubmit={onSubmit}>
        <Box as="button" borderRadius="md" color="gray" px={4} h={8}>
          Button werwerwer werwerewrew
        </Box>
        <Divider />
        <Box as="button" borderRadius="md" color="gray" px={4} h={8}>
          Button werwerwer werwerewrew
        </Box>
      </Stack>
    </Box>
  );
}

function UserReviews(): React.ReactElement {
  return (
    <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
      <Stack align="center">
        <Heading fontSize="4xl">유저 페이지</Heading>
        <Text fontSize="lg" color="gray.600"></Text>
      </Stack>
      <UserCutReviewList />
    </Stack>
  );
}

export default UserReviews;
