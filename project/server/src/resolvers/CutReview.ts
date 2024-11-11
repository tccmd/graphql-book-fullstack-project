import { IsInt, IsString } from 'class-validator';
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { CutReview } from '../entities/CutReview';
import { isAuthenticated } from '../middleweres/isAuthenticated';
import { MyContext } from '../apollo/createApolloServer';
import User from '../entities/User';
import { Not } from 'typeorm';

// 명장면 번호(cutId)와 감상평 내용(contests) 필드를 필수적으로 요구
@InputType()
class CreateOrUpdateCutReviewInput {
  @Field(() => Int, { description: '명장면 번호' })
  @IsInt()
  cutId!: number;

  @Field({ description: '감상평 내용' })
  @IsString()
  contents!: string;
}

// @ArgsType(): TypeGraphQL에서 제공하는 가상의 타입, 각각의 필드를 @Arg()로 등록한다.
@ArgsType()
export class PaginationArgs {
  // 조회할 감상평의 총 개수
  @Field(() => Int, { defaultValue: 2 })
  take!: number;

  // 뛰어 넘을 감상평 번호
  @Field(() => Int, { nullable: true })
  skip?: number;

  @Field(() => Int, { nullable: true }) cutId?: number;
}

@Resolver(CutReview)
export class CutReviewResolver {
  @FieldResolver(() => Boolean)
  isMine(@Root() cutReview: CutReview, @Ctx() { verifiedUser }: MyContext): boolean {
    if (!verifiedUser) return false;
    return cutReview.userId === verifiedUser.userId;
  }

  @Query(() => [CutReview])
  async cutReviews(
    @Args() { take, skip, cutId }: PaginationArgs,
    @Ctx() { verifiedUser }: MyContext,
  ): Promise<CutReview[]> {
    let realTake = 5;
    let reviewHistory: CutReview | undefined | null;
    if (verifiedUser && verifiedUser.userId) {
      // 로그인된 유저가 작성한 감상평이 있는지 조회
      reviewHistory = await CutReview.findOne({
        where: { user: { id: verifiedUser.userId }, cutId },
      });
    }

    if (reviewHistory) {
      // 본인 감상평이 있다면 최대 가져올 리뷰 개수를 1로 제한
      realTake = Math.min(take, 1);
    }

    // 감상평 조회, 본인의 리뷰는 제외
    const reviews = await CutReview.find({
      where: reviewHistory ? { cutId, id: Not(reviewHistory.id) } : { cutId },
      skip,
      take: realTake,
      order: { createdAt: 'DESC' },
    });

    // 본인 감상평이 있으면 추가
    if (reviewHistory) return [reviewHistory, ...reviews];
    return reviews;
  }

  // @Query(() => [CutReview])
  // async userCutReviews(
  //   @Args() { take, skip }: PaginationArgs,
  //   @Ctx() { verifiedUser }: MyContext,
  // ): Promise<CutReview[]> {
  //   let reviews;
  //   if (verifiedUser && verifiedUser.userId) {
  //     reviews = await CutReview.find({
  //       where: { user: { id: verifiedUser.userId } },
  //       skip,
  //       take: take,
  //       order: { createdAt: 'DESC' },
  //     });
  //     return reviews;
  //   }
  //   return [];
  // }

  @Mutation(() => CutReview, { nullable: true })
  @UseMiddleware(isAuthenticated)
  async createOrUpdateCutReview(
    @Arg('cutReviewInput') cutReviewInput: CreateOrUpdateCutReviewInput,
    @Ctx() { verifiedUser }: MyContext,
  ): Promise<CutReview | null> {
    if (!verifiedUser) return null;
    const { contents, cutId } = cutReviewInput;
    // cutId에 대한 기존 감상평 조회
    const prevCutReview = await CutReview.findOne({ where: { cutId, user: { id: verifiedUser.userId } } });
    // cutId에 대한 기존 감상평이 있을 경우
    if (prevCutReview) {
      prevCutReview.contents = contents;
      return prevCutReview.save();
    }
    // cutId에 대한 기존 감상평이 없는 경우
    const cutReview = CutReview.create({
      contents: cutReviewInput.contents,
      cutId: cutReviewInput.cutId,
      user: {
        id: verifiedUser.userId,
      },
    });
    return cutReview.save();
  }
  // 필드 리졸버 User
  @FieldResolver(() => User)
  async user(@Root() cutReview: CutReview): Promise<User> {
    return (await User.findOne({ where: { id: cutReview.userId } }))!;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async deleteReview(@Arg('id', () => Int) id: number, @Ctx() { verifiedUser }: MyContext): Promise<boolean> {
    const result = await CutReview.delete({
      id,
      user: { id: verifiedUser.userId },
    });
    if (result.affected && result.affected > 0) {
      return true;
    }
    return false;
  }
}
