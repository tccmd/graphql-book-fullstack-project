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
} from 'type-graphql';
import Notification from '../entities/Notification';
import { isAuthenticated } from '../middleweres/isAuthenticated';
import { MyContext } from '../apollo/createApolloServer';

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
  @Subscription({ topics: 'NOTIFICATION_CREATED' })
  // @Root() 데코레이터로 이벤트가 트리거 될 때 함께 전송될 데이터 Notification을 받아오도록 구성
  newNotification(@Root() notificationPayload: Notification): Notification {
    // 이후 받아온 알림 데이터를 그대로 반환
    return notificationPayload;
  }
}
