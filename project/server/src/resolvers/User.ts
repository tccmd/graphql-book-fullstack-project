// 이메일 유효성 검사를 위한 데코레이터와 문자열 유효성 검사를 위한 데코레이터를 class-validator에서 가져옴
import { IsEmail, IsString } from 'class-validator';
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver, UseMiddleware } from 'type-graphql';
import User from '../entities/User';
// 비밀번호 해시화를 위한 argon2 라이브러리 전체를 불러옴
import * as argon2 from 'argon2';
import {
  createAccessToken,
  createRefreshToken,
  REFRESH_JWT_SECRET_KEY,
  setRefreshTokenHeader,
} from '../utils/jwt-auth';
import { MyContext } from '../apollo/createApolloServer';
import { isAuthenticated } from '../middleweres/isAuthenticated';
import jwt from 'jsonwebtoken';

// GraphQL에서 입력으로 받을 데이터 구조를 정의하는 클래스
// 이 클래스는 GraphQL의 InputType으로 사용되며, 회원가입 요청 시 필요한 데이터를 정의함
@InputType()
export class SignUpInput {
  // 요청을 통해 들어온 email 필드값이 이메일 형태가 아닐 경우 signUp 함수는 실행되지 않고 곧바로 에러를 반환한다.
  @Field() @IsEmail() email!: string;

  // 문자열이 아니라면 위와 같다.
  @Field() @IsString() username!: string;

  @Field() @IsString() password!: string;
}

// 로그인 시 필요한 정보를 담는 graphQl input 타입
// 이메일 또는 아이디와 비밀번호 입력을 통해 사용자를 식별할 예정이므로, emailOrUsername과 password를 필드로 갖도록 구성
// class-validator의 @IsString() 유효성 검사 데코레이터를 각 필드에 추가
@InputType({ description: '로그인 인풋 데이터' })
export class LoginInput {
  @Field() @IsString() emailOrUsername!: string;
  @Field() @IsString() password!: string;
}

// 로그인 시 입력한 필드 중 어느 필드에서 오류가 발생했는지와 해당 필드의 오류에 대한 메시지 정보를 담고 있다.
@ObjectType({ description: '필드 에러 타입' })
class FieldError {
  @Field() field!: string;
  @Field() message!: string;
}

// 로그인 작업이 끝난 이후, 반환될 데이터의 타입
// errors 필드는 FieldError 타입의 배열을 반환하거나, null을 반환
// user는 로그인이 성공한 경우 제공되는 로그인한 유저의 정보. 로그인이 실패할 경우 null 반환
// accessToken은 로그인이 성공한 경우 제공되는 인증용 JWT 토근. 로그인이 실패할 경우 null 반환
@ObjectType({ description: '로그인 반환 데이터' })
class LoginResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;

  @Field({ nullable: true })
  accessToken?: string;
}

@ObjectType({ description: '액세스 토큰 새로고침 반환 데이터' })
class RefreshAccessTokenResponse {
  @Field() accessToken?: string;
}

@Resolver(User)
export class UserResolver {
  // me 쿼리가 실행되기 전에 언제나 미들웨어 함수를 거치게 된다.
  // 이제 로그인이 필요한 쿼리나 뮤테이션에 @UseMiddleware(isAuthenticated) 데코레이터를 추가하면 로그인 여부를 자동으로 체크하게 된다.
  @UseMiddleware(isAuthenticated)
  @Query(() => User, { nullable: true })
  // @Ctx: context 데코레이터
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    if (!ctx.verifiedUser) return undefined;
    // return User.findOne({ where: { id: ctx.verifiedUser.userId } });
    const user = await User.findOne({ where: { id: ctx.verifiedUser.userId } });
    return user || undefined;
  }

  // 이 함수는 User 타입의 데이터를 반환함
  @Mutation(() => User)
  // UserResolver 클래스의 signUp 메서드, 위 데코레이터로 "User 타입을 반환하는 뮤테이션"으로 구현되었다.
  async signUp(@Arg('signUpInput') signUpInput: SignUpInput): Promise<User> {
    // "signUp 뮤테이션"은 signUpInput이라는 파라미터 변수를 받도록 @Arg() 데코레이터를 통해 설정했다. signUpInput은 nullable이 아니므로, signUp 뮤테이션 요청 시 언제나 필요한 필수 파라미터이다.
    // 클라이언트가 보낸 이메일, 유저네임, 비밀번호를 signUpInput에서 추출
    const { email, username, password } = signUpInput;

    // 비밀번호를 argon2 라이브러리로 해시화 // 단방향 암호화 처리
    const hashedPw = await argon2.hash(password);

    // User 엔터티의 인스턴스를 생성하고, 해시화된 비밀번호를 포함한 유저 정보를 설정
    const newUser = User.create({
      email,
      username,
      password: hashedPw,
    });

    // 새로 생성된 유저 정보를 데이터베이스에 삽입
    await User.insert(newUser);

    // 새로 생성된 유저 객체를 반환 (GraphQL 응답으로 클라이언트에게 전달됨)
    return newUser;
  }

  @Mutation(() => LoginResponse)
  // @Ctx() 데코레이터를 이용해 context 객체를 가져온다. 이 중 응답 객체 res만 필요하므로 res만 비구조화 할당하여 가져온다.
  // @Ctx() 데코레이터를 통해 접근한 context 중 redis를 비구조화 할당하도록 구성
  public async login(
    @Arg('loginInput') loginInput: LoginInput,
    @Ctx() { res, redis }: MyContext,
  ): Promise<LoginResponse> {
    // 유저 확인 로직
    // 입력받은 loginInput 데이터로부터 emailOrusername과 password를 가져온다.
    const { emailOrUsername, password } = loginInput;

    // 이후 데이터베이스에서 해당 email 또는 username을 가지는 유저 정보를 찾는다.
    const user = await User.findOne({ where: [{ email: emailOrUsername }, { username: emailOrUsername }] });
    if (!user)
      return {
        // 만약 유저를 못 찾는다면 FieldError의 배열을 반환한다.
        errors: [{ field: 'emailOrUsername', message: '해당하는 유저가 없습니다.' }],
      };

    // 유저를 찾았다면 argon2의 verify 함수를 이용해 가입 시 입력한 암호화된 비밀번호와 현재 로그인을 위해 입력된 비밀번호를 비교한다.
    // boolean 반환
    const isValid = await argon2.verify(user.password, password);
    // 틀린 비밀번호인 경우 FieldError 배열 반환
    if (!isValid)
      return {
        errors: [{ field: 'password', message: '비밀번호를 올바르게 입력해주세요.' }],
      };
    // 올바른 비밀번호인 경우 로그인이 완료되었으므로 user 정보를 반환

    // 엑세스 토큰 발급
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    // 리프레시 토큰 레디스 적재
    // 유저의 id를 키로 하고, 생성된 리프레시 토큰을 값으로 하는 레디스 레코드를 redis.set으로 생성
    await redis.set(String(user.id), refreshToken);
    // 쿠키로 리프레시 토큰 전송
    setRefreshTokenHeader(res, refreshToken);

    return { user, accessToken };
  }

  @Mutation(() => RefreshAccessTokenResponse, { nullable: true })
  async refreshAccessToken(@Ctx() { req, redis, res }: MyContext): Promise<RefreshAccessTokenResponse | null> {
    // 요청 객체로 req로 부터 "refreshtoken" 쿠키값을 가져온다.
    console.log('req.headers: ', req.headers);
    const refreshToken = req.cookies.refreshtoken;
    // 해당 쿠키가 없을 경우 액세스 토큰을 재발급하지 않고 null 반환
    console.log('resolver 쿠키 - refreshToken:', refreshToken); // Step 1
    if (!refreshToken) return null;

    // 있는 경우
    let tokenData: any = null;
    try {
      // 해당 리프레시 토큰을 jwt.verify로 검증
      tokenData = jwt.verify(refreshToken, REFRESH_JWT_SECRET_KEY);
      console.log('tokenData:', tokenData); // Step 2
    } catch (e) {
      // 리프레시 토큰이 만료되었거나, 올바르지 못한 토큰이 전달되어 검증할 수 없다면 null 반환
      console.error(e);
      return null;
    }
    // 리프레시 토큰이 만료되었거나, 올바르지 못한 토큰이 전달되어 검증할 수 없다면 null 반환
    if (!tokenData) return null;

    // 레디스에 user.id로 저장된 토큰 조회
    // tokenData.userId 데이터를 통해 레디스에 동일한 키값으로 저장된 리프레시 토큰이 있는지 확인
    const storedRefreshToken = await redis.get(String(tokenData.userId));
    console.log('resolver 레디스 조회 - storedRefreshToken:', storedRefreshToken); // Step 3
    // 레디스에 userId 없는 경우 null
    if (!storedRefreshToken) return null;
    // 레디스에 저장된 리프레시 토큰과 전송된 리프레시 토큰이 다른 경우에도 null
    if (!(storedRefreshToken === refreshToken)) {
      console.log('Tokens do not match'); // Step 4
      return null;
    }
    // userId 값을 통해 데이터베이스로부터 User 객체 조회
    const user = await User.findOne({ where: { id: tokenData.userId } });
    // User 조회할 수 없는 경우에도 재발급하지 않고 null
    console.log('user:', user); // Step 5
    if (!user) return null;

    // 여기까지의 과정(리프래시 토큰 쿠키값 존재, 검증된 토큰, 레디스에 userId로 저장된 값 존재, 레디스 값과 전송된 리프레시 토큰 같음, DB에 User 존재)을 모두 통과한 경우
    const newAccessToken = createAccessToken(user); // 액세스 토큰 생성
    const newRefreshToken = createRefreshToken(user); // 리프레시 토큰 생성
    // 새롭게 발급한 리프레시 토큰 redis 저장
    await redis.set(String(user.id), newRefreshToken);

    // 쿠키로 새로 발급한 리프레시 토큰 전송
    res.cookie('refreshtoken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    // 새롭게 발급한 액세스 토큰 반환
    return { accessToken: newAccessToken };
  }
}
