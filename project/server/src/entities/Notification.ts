import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from './User';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export default class Notification extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: 'varchar' })
  text?: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt?: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt?: Date;

  @Field()
  @Column()
  userId!: number;

  @ManyToOne(() => User, (user) => user.notification)
  user?: User;
}
