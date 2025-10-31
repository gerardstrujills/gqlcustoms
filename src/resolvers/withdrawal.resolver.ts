import {
  Arg,
  Field,
  InputType,
  Int,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Product } from "../schemas/product";
import { Withdrawal } from "../schemas/withdrawal";

@InputType()
class WithdrawalFilters {
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
  title?: string;
}

@ObjectType()
class WithdrawalProductInfo {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String)
  unitOfMeasurement: string;

  @Field(() => String)
  materialType: string;
}

@ObjectType()
class WithdrawalKardexResponse {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Date)
  endTime: Date;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => WithdrawalProductInfo)
  product: WithdrawalProductInfo;
}

@Resolver()
export class WithdrawalKardexResolver {
  @Query(() => [WithdrawalKardexResponse], { nullable: true })
  async withdrawals(
    @Arg("filters", () => WithdrawalFilters, { nullable: true })
    filters?: WithdrawalFilters
  ): Promise<WithdrawalKardexResponse[] | null> {
    try {
      let query = Withdrawal.createQueryBuilder("w")
        .select([
          `w.id as id`,
          `w.title as title`,
          `w.quantity as quantity`,
          `CAST(w.endTime as TIMESTAMP) as "endTime"`,
          `CAST(w.createdAt as TIMESTAMP) as "createdAt"`,
          `CAST(w.updatedAt as TIMESTAMP) as "updatedAt"`,
          `JSON_BUILD_OBJECT(
            'id', p.id,
            'title', p.title,
            'description', COALESCE(p.description, ''),
            'unitOfMeasurement', p."unitOfMeasurement",
            'materialType', p."materialType"
          ) as product`,
        ])
        .leftJoin(Product, "p", 'p.id = w."productId"');

      // Aplicar filtros
      if (filters) {
        // Filtros por producto
        if (filters.description) {
          query = query.andWhere("p.description ILIKE :description", {
            description: `%${filters.description}%`,
          });
        }

        if (filters.unitOfMeasurement) {
          query = query.andWhere('p."unitOfMeasurement" = :unitOfMeasurement', {
            unitOfMeasurement: filters.unitOfMeasurement,
          });
        }

        if (filters.materialType) {
          query = query.andWhere('p."materialType" = :materialType', {
            materialType: filters.materialType,
          });
        }

        // Filtros por fecha
        if (filters.startTime && filters.endTime) {
          query = query.andWhere("w.endTime BETWEEN :startTime AND :endTime", {
            startTime: filters.startTime,
            endTime: filters.endTime,
          });
        } else if (filters.startTime) {
          query = query.andWhere("w.endTime >= :startTime", {
            startTime: filters.startTime,
          });
        } else if (filters.endTime) {
          query = query.andWhere("w.endTime <= :endTime", {
            endTime: filters.endTime,
          });
        }

        // Filtro por título de withdrawal
        if (filters.title) {
          query = query.andWhere("w.title ILIKE :title", {
            title: `%${filters.title}%`,
          });
        }
      }

      const result = await query.orderBy("w.createdAt", "DESC").getRawMany();

      // TypeORM ya parsea automáticamente los objetos JSON
      // Solo necesitamos mapear los campos correctamente
      return result.map((item) => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        endTime: item.endTime,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        product: item.product, // Ya viene parseado automáticamente
      })) as WithdrawalKardexResponse[];
    } catch (error) {
      console.log("Error fetching withdrawals:", error);
      return null;
    }
  }
}