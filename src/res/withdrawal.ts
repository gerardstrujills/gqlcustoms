import { Field, InputType } from "type-graphql";
import { TrimmedStringField } from "../utils/decorators/string";

@InputType()
export class WithdrawalInput {
  @Field(() => Number)
  productId: number;
  
  @Field(() => String)
  @TrimmedStringField()
  title: string;

  @Field(() => Number)
  quantity: number;
  
  @Field(() => Date)
  endTime: Date;
}

@InputType()
export class WithdrawalUpdateInput {
    @Field(() => String)
    @TrimmedStringField()
    title: string;
  
    @Field(() => Number)
    quantity: number;
    
    @Field(() => Date)
    endTime: Date;
  }