// src/resolvers/income.resolver.ts
import {
  Arg,
  Field,
  Float,
  InputType,
  Int,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Entry } from "../schemas/entry";
import { Product } from "../schemas/product";
import { Supplier } from "../schemas/supplier";

@InputType()
class IncomeFilters {
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

@ObjectType()
class ProductInfo {
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
class SupplierInfo {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  ruc?: string;

  @Field(() => String, { nullable: true })
  district?: string;

  @Field(() => String, { nullable: true })
  province?: string;

  @Field(() => String, { nullable: true })
  department?: string;
}

@ObjectType()
class IncomeResponse {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;

  @Field(() => Date)
  startTime: Date;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => ProductInfo)
  product: ProductInfo;

  @Field(() => SupplierInfo)
  supplier: SupplierInfo;
}

@Resolver()
export class IncomeResolver {
  @Query(() => [IncomeResponse], { nullable: true })
  async incomes(
    @Arg("filters", () => IncomeFilters, { nullable: true })
    filters?: IncomeFilters
  ): Promise<IncomeResponse[] | null> {
    try {
      let query = Entry.createQueryBuilder("e")
        .select([
          `e.id as id`,
          `e.quantity as quantity`,
          `e.price as price`,
          `CAST(e.startTime as TIMESTAMP) as "startTime"`,
          `CAST(e.createdAt as TIMESTAMP) as "createdAt"`,
          `CAST(e.updatedAt as TIMESTAMP) as "updatedAt"`,
          `JSON_BUILD_OBJECT(
            'id', p.id,
            'title', p.title,
            'description', COALESCE(p.description, ''),
            'unitOfMeasurement', p."unitOfMeasurement",
            'materialType', p."materialType"
          ) as product`,
          `JSON_BUILD_OBJECT(
            'id', s.id,
            'name', s.name,
            'ruc', COALESCE(s.ruc, ''),
            'district', COALESCE(s.district, ''),
            'province', COALESCE(s.province, ''),
            'department', COALESCE(s.department, '')
          ) as supplier`,
        ])
        .leftJoin(Product, "p", 'p.id = e."productId"')
        .leftJoin(Supplier, "s", 's.id = e."supplierId"');

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
          query = query.andWhere(
            "e.startTime BETWEEN :startTime AND :endTime",
            {
              startTime: filters.startTime,
              endTime: filters.endTime,
            }
          );
        } else if (filters.startTime) {
          query = query.andWhere("e.startTime >= :startTime", {
            startTime: filters.startTime,
          });
        } else if (filters.endTime) {
          query = query.andWhere("e.startTime <= :endTime", {
            endTime: filters.endTime,
          });
        }

        // Filtros por supplier
        if (filters.supplierName) {
          query = query.andWhere("s.name ILIKE :supplierName", {
            supplierName: `%${filters.supplierName}%`,
          });
        }

        if (filters.supplierRuc) {
          query = query.andWhere("s.ruc ILIKE :supplierRuc", {
            supplierRuc: `%${filters.supplierRuc}%`,
          });
        }

        if (filters.supplierDistrict) {
          query = query.andWhere("s.district ILIKE :supplierDistrict", {
            supplierDistrict: `%${filters.supplierDistrict}%`,
          });
        }

        if (filters.supplierProvince) {
          query = query.andWhere("s.province ILIKE :supplierProvince", {
            supplierProvince: `%${filters.supplierProvince}%`,
          });
        }

        if (filters.supplierDepartment) {
          query = query.andWhere("s.department ILIKE :supplierDepartment", {
            supplierDepartment: `%${filters.supplierDepartment}%`,
          });
        }
      }

      const result = await query.orderBy("e.createdAt", "DESC").getRawMany();

      // TypeORM ya parsea automáticamente los objetos JSON
      // Solo necesitamos mapear los campos
      return result.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: parseFloat(item.price),
        startTime: item.startTime,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        product: item.product,
        supplier: item.supplier,
      })) as IncomeResponse[];
    } catch (error) {
      console.log("Error fetching incomes:", error);
      return null;
    }
  }
}
