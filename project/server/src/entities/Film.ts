import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class Film {
  @Field(() => Int, { description: '영화 고유 아이디' })
  id: number;

  @Field({ description: '영화 제목' })
  title: string;

  @Field({ nullable: true, description: '영화 부제목' })
  subtitle?: string;

  @Field({ description: '영화 장르' })
  genre: string;

  @Field({ description: '영화 러닝 타임, minute'})
  runningTime: number;

  @Field({ description: '영화 줄거리 및 설명' })
  description: string;

  @Field(() => Int, { description: '제작자 고유 아이디'})
  director_id: number;

  @Field({ description: '포스터 이미지 URL' })
  posterImg: string;

  @Field({ description: '개봉일' })
  release: string;
  
  // 생성자를 통해 프로퍼티 초기화
  constructor(
    id: number, 
    title: string, 
    genre: string, 
    runningTime: number, 
    description: string, 
    director_id: number,
    posterImg: string,
    release: string
  ) {
    this.id = id;
    this.title = title;
    this.genre = genre;
    this.runningTime = runningTime;
    this.description = description;
    this.director_id = director_id;
    this.posterImg = posterImg;
    this.release = release;
  }
}