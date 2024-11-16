import {
  Box,
  CircularProgress,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuList,
  Text,
  useToast,
} from '@chakra-ui/react';
import { NewNotificationDocument, NewNotificationSubscription, useNotificationsQuery } from '../../generated/graphql';
import NotificationItem from './NotificationItem';
import { FaBell } from 'react-icons/fa';
import { useEffect, useRef } from 'react';

function Notification(): React.ReactElement {
  // subscribeToMore: Subscription을 통해 전달된 데이터가 해당 쿼리의 데이터를 업데이트하는 시나리오를 쉽게 구성할 수 있게 도와준다.
  const { data, loading, subscribeToMore } = useNotificationsQuery();

  const toast = useToast({
    position: 'top-right',
    isClosable: true,
    status: 'info',
  });

  // 실시간 알림 토스트 중복 문제 해결
  const processedNotifications = useRef(new Set<number>());

  useEffect(() => {
    console.log('[useEffect] Executed: subscribeToMore is being set up');
    subscribeToMore<NewNotificationSubscription>({
      document: NewNotificationDocument,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const newNoti = subscriptionData.data.newNotification;

        // 이미 처리된 알림인지 확인
        if (processedNotifications.current.has(newNoti.id)) {
          console.log('[subscribeToMore] Duplicate notification ignored:', newNoti.id);
          return prev;
        }

        // 새 알림 처리
        processedNotifications.current.add(newNoti.id);
        console.log('[subscribeToMore] New Notification:', newNoti);

        toast({
          title: `새 알림이 도착했습니다!`,
          description: newNoti.text.length > 30 ? `${newNoti.text.slice(0, 30)}...` : newNoti.text,
        });

        return {
          __typename: 'Query',
          notifications: [newNoti, ...prev.notifications],
        };
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Menu placement="bottom-end" closeOnSelect={false} isLazy>
      <Box position="relative">
        <MenuButton
          as={IconButton}
          size="md"
          fontSize="lg"
          variant="ghost"
          color="current"
          icon={<FaBell />}
          aria-label="open notification popover"
        />
      </Box>
      <MenuList maxH={350} maxW={400} overflowY="auto" w="100%">
        <Text px={4} py={2}>
          알림 목록
        </Text>
        <MenuDivider />

        {loading ? (
          <CircularProgress isIndeterminate />
        ) : (
          <>
            {!data || data?.notifications.length === 0 ? (
              <Text px={4} py={2}>
                아직 알림이 없습니다..
              </Text>
            ) : (
              data?.notifications.map((noti, index) => <NotificationItem key={index} notification={noti} />)
            )}
          </>
        )}
      </MenuList>
    </Menu>
  );
}

export default Notification;
