import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  Subscription,
  UseMiddleware,
  PubSub,
  Publisher,
  ResolverFilterData,
} from 'type-graphql';
import Notification from '../entities/Notification';
import { isAuthenticated } from '../middleweres/isAuthenticated';
import { MyContext } from '../apollo/createApolloServer';
import { MySubscriptionContext } from '../apollo/createSubscriptionServer';

@Resolver(Notification)
export class NotificationResolver {
  @Query(() => [Notification], { description: '세션에 해당되는 유저의 모든 알림을 가져온다.' })
  @UseMiddleware(isAuthenticated)
  async notifications(@Ctx() { verifiedUser }: MyContext): Promise<Notification[]> {
    const notifications = await Notification.find({
      where: { userId: verifiedUser.userId },
      order: { createdAt: 'DESC' },
    });
    return notifications;
  }

  @UseMiddleware(isAuthenticated)
  @Mutation(() => Notification)
  async createNotification(
    @Arg('userId', () => Int) userId: number,
    @Arg('text') text: string,
    // @PubSub() 데코레이터를 통해 알림 생성 이벤트를 발행하는 publish 함수를 가져올 수 있다.
    // 해당 함수의 타입은 Publisher<Notification>과 같이 구성
    @PubSub('NOTIFICATION_CREATED') publish: Publisher<Notification>,
  ): Promise<Notification> {
    // 알림을 생성
    const newNoti = await Notification.create({
      text,
      userId,
    }).save();
    await publish(newNoti); // 알림 생성 이벤트 발행
    // 생성된 알림 정보를 반환
    return newNoti;
  }

  // @Subsctiption() 데코레이터를 통해 newNotification 메서드를 Subscription으로 구성한다.
  // topics 속성의 "NOTIFICATION_CREATED"라는 값은 현재 Subscription 요청에서 구독할 이벤트의 이름을 의미
  @Subscription({
    topics: 'NOTIFICATION_CREATED',
    // 자기 자신에게 온 알림이 생성되었을 때만 실행되어야 함.
    // payload는 발행된 newNoti 객체
    // filter 필드: boolean 값을 반환하는 콜백 함수를 요구한다. 이 함수에는 트리거 시 전달된 데이터 payload와 context가 전달된다.
    // 이벤트가 발생하면 먼저 filter 함수가 실행되고, filter 함수의 반환값이 참인 경우에만 메서드가 실행되므로 유저 본인에게 전달된 알림의 경우에만 알림이 전송된다.
    filter: ({ payload, context }: ResolverFilterData<Notification, null, MySubscriptionContext>) => {
      console.log('Resolver_Noti_newNotification__context', context);
      const { verifiedUser } = context;
      // 로그인한 유저의 userId와 전달된 알림 데이터 payload의 userid 필드를 비교해 전달될 유저한테만 true를 반환하는 것
      if (verifiedUser && payload && payload.userId === verifiedUser.userId) {
        return true;
      }
      return false;
    },
  })
  // @Root() 데코레이터로 이벤트가 트리거 될 때 함께 전송될 데이터 Notification을 받아오도록 구성
  newNotification(@Root() notificationPayload: Notification): Notification {
    // 이후 받아온 알림 데이터를 그대로 반환
    return notificationPayload;
  }
}
