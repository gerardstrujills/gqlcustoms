import { removeUnnecessarySpaces } from "../utils/functions/string";
import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Entry } from "./entry";
import { Withdrawal } from "./withdrawal";

@ObjectType()
@Entity()
export class Product extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => [Entry])
  entry: Entry[];

  @OneToMany(() => Entry, (p) => p.productSchema)
  entries: Entry[];

  @OneToMany(() => Withdrawal, (p) => p.product)
  withdrawals: Withdrawal[];

  @Field(() => [Withdrawal])
  withdrawal: Withdrawal[];

  @Field(() => String, { nullable: false })
  @Column({ type: "text", nullable: false })
  title: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  description: string | null;

  @Field(() => String, { nullable: false })
  @Column({ type: "text", nullable: false })
  unitOfMeasurement: string;

  @Field(() => String, { nullable: false })
  @Column({ type: "text", nullable: false })
  materialType: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  formatStringFields() {
    this.title = removeUnnecessarySpaces(this.title) as string;
  }
}
