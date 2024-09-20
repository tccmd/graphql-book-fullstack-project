import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
export class Director {
  @Field(() => Int)
  id: number

  @Field(() => String)
  name: string

  constructor(
    id: number, 
    name:string
  ) {
    this.id = id;
    this.name = name;
  }
}