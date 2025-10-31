import { Field, InputType } from "type-graphql";

@InputType()
export class StockFiltersInput {
  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  unitOfMeasurement?: string;

  @Field(() => String, { nullable: true })
  materialType?: string;

  @Field(() => Date, { nullable: true })
  startTime?: Date;

  @Field(() => Date, { nullable: true })
  endTime?: Date;

  @Field(() => String, { nullable: true })
  supplierName?: string;

  @Field(() => String, { nullable: true })
  supplierRuc?: string;

  @Field(() => String, { nullable: true })
  supplierDistrict?: string;

  @Field(() => String, { nullable: true })
  supplierProvince?: string;

  @Field(() => String, { nullable: true })
  supplierDepartment?: string;
}