import { TrimmedStringField } from "../utils/decorators/string";
import { Field, InputType } from "type-graphql";

@InputType()
export class SupplierRuc {
  @Field(() => String)
  @TrimmedStringField()
  ruc: string;
}

@InputType()
export class SupplierInput {
  @Field(() => String)
  @TrimmedStringField()
  name: string;

  @Field(() => String, { nullable: true })
  @TrimmedStringField()
  address: string | null;

  @Field(() => String, { nullable: true })
  @TrimmedStringField()
  district: string | null;

  @Field(() => String, { nullable: true })
  @TrimmedStringField()
  province: string | null;

  @Field(() => String, { nullable: true })
  department: string | null;
}
