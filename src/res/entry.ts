import { TrimmedStringField } from "../utils/decorators/string";
import { InputType, Field, Float } from "type-graphql";

@InputType()
export class EntryInput {
  @Field(() => Number)
  productId: number;
  @Field(() => String)
  @TrimmedStringField()
  ruc: string;
  @Field(() => Number)
  quantity: number;
  @Field(() => Float)
  price: number;
  @Field(() => Date)
  startTime: Date;
}
@InputType()
export class EntryUpdateInput {
  @Field(() => Number)
  quantity: number;
  @Field(() => Float)
  price: number;
  @Field(() => Date)
  startTime: Date;
}
