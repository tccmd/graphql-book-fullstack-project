import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import CommonLayout from '../components/CommonLayout';
import UserReviews from '../components/user/reviews/UserReview';

function User(): React.ReactElement {
  return (
    <Box bg={useColorModeValue('gray.50', 'gray.800')}>
      <CommonLayout>
        <Flex align="center" justify="center">
          <UserReviews />
        </Flex>
      </CommonLayout>
    </Box>
  );
}

export default User;
