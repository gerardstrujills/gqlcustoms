import { TrimmedStringField } from "../utils/decorators/string";
import { InputType, Field } from "type-graphql";

@InputType()
export class ProductInput {
  @Field(() => String)
  @TrimmedStringField()
  title: string;

  @Field({ nullable: true })
  @TrimmedStringField()
  description: string;

  @Field(() => String)
  @TrimmedStringField()
  unitOfMeasurement: string;

  @Field(() => String)
  @TrimmedStringField()
  materialType: string;
}
