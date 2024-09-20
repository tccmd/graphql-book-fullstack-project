import { Query, Resolver, FieldResolver, Root, ObjectType, Field, Int } from "type-graphql";
import ghibliData from "../data/ghibli";
import { Film } from "../entities/Film";
import { Director } from "../entities/Director";

// 페이지 처리된 영화 목록 반환 오브젝트 타입
@ObjectType()
class PaginatedFilms {
  @Field(() => [Film])
  films!: Film[]

  @Field(() => Int, { nullable: true })
  cursor?: Film[ 'id' ] | null;
}

@Resolver(Film)
export class FilmResolver {
  @Query(() => [Film])
  films(): Film[] {
    return ghibliData.films;
  }

  @FieldResolver(() => Director)
  director(@Root() parentFilm: Film) : Director | undefined {
    return ghibliData.directors.find((dr) => dr.id === parentFilm.director_id)
  }
}