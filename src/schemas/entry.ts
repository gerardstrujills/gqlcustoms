import { Field, Float, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Product } from "./product";
import { Supplier } from "./supplier";

@ObjectType()
@Entity()
export class Entry extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: "int", nullable: true })
  productId: number;

  @ManyToOne(() => Product, (p) => p.entries, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productId", referencedColumnName: "id" })
  productSchema: Product;

  @Field(() => Product)
  product: Product;

  @Field(() => Int, { nullable: true })
  @Column({ type: "int", nullable: true })
  supplierId: number;

  @ManyToOne(() => Supplier, (p) => p.entries, { onDelete: "CASCADE" })
  @JoinColumn({ name: "supplierId", referencedColumnName: "id" })
  supplierSchema: Supplier;

  @Field(() => Supplier)
  supplier: Supplier;

  @Field(() => Number)
  @Column({ type: "integer", nullable: false })
  quantity: number;

  @Field(() => Float)
  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  price: number;

  @Field(() => Date)
  @Column({ type: "timestamp", nullable: false })
  startTime: Date;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
