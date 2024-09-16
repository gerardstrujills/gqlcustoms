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
import { Field, Int, ObjectType } from "type-graphql";
import { removeUnnecessarySpaces } from "../utils/functions/string";
import { Entry } from "./entry";

@ObjectType()
@Entity()
export class Supplier extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;
  
  @OneToMany(() => Entry, (c) => c.supplierSchema)
  entries: Entry[];
  
  @Field(() => [Entry])
  entry: Entry[];

  @Field(() => String)
  @Column({ type: "varchar", length: 250, nullable: false })
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 11, nullable: true })
  ruc: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 250, nullable: true })
  address: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 250, nullable: true })
  district: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 250, nullable: true })
  province: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 250, nullable: true })
  department: string | null;

  @Field(() => Int, { nullable: false })
  productCount: number;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  formatStringFields() {
    this.name = removeUnnecessarySpaces(this.name) as string;
    this.ruc = removeUnnecessarySpaces(this.ruc);
    this.address = removeUnnecessarySpaces(this.address);
    this.district = removeUnnecessarySpaces(this.district);
    this.province = removeUnnecessarySpaces(this.province);
    this.department = removeUnnecessarySpaces(this.department);
  }
}
