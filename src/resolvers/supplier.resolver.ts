import axios, { AxiosError } from "axios";
import { SupplierInput, SupplierRuc } from "../res/supplier";
import { Supplier } from "../schemas/supplier";
import { validateSupplier } from "../validator/supplier";
import {
  Arg,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../middleware/isAuth";

@ObjectType()
class SupplierFieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class SupplierResponse {
  @Field(() => [SupplierFieldError], { nullable: true })
  errors?: SupplierFieldError[];

  @Field(() => Supplier, { nullable: true })
  supplier?: Supplier;
}

@Resolver(Supplier)
export class SupplierResolver {
  @Query(() => [Supplier], { nullable: true })
  @UseMiddleware(isAuth)
  async suppliers(): Promise<Supplier[] | null> {
    try {
      const suppliers = await Supplier.createQueryBuilder("s")
        .select([
          `"s"."id" as id`,
          `"s"."name" as name`,
          `"s"."ruc" as ruc`,
          `"s"."address" as address`,
          `"s"."district" as district`,
          `"s"."province" as province`,
          `"s"."department" as department`,
          `CAST(s.createdAt as TIMESTAMP) as "createdAt"`,
          `CAST(s.updatedAt as TIMESTAMP) as "updatedAt"`,
          `(SELECT COUNT(*) FROM entry e WHERE e."supplierId" = s.id) AS "productCount"`,
        ])
        .orderBy("s.createdAt", "DESC")
        .getRawMany();

      return suppliers || null;
    } catch (e) {
      console.log("Error fetching suppliers:", e);
      return null;
    }
  }

  @Query(() => Supplier, { nullable: true })
  @UseMiddleware(isAuth)
  async supplier(@Arg("id", () => Int) id: number): Promise<Supplier | null> {
    try {
      const result: Supplier | undefined = await Supplier.createQueryBuilder(
        "s"
      )
        .select([
          `"s"."id" as id`,
          `"s"."name" as name`,
          `"s"."ruc" as ruc`,
          `"s"."address" as address`,
          `"s"."district" as district`,
          `"s"."province" as province`,
          `"s"."department" as department`,
          `CAST(s.createdAt as TIMESTAMP) as "createdAt"`,
          `CAST(s.updatedAt as TIMESTAMP) as "updatedAt"`,
          `(SELECT COUNT(*) FROM entry e WHERE e."supplierId" = s.id) AS "productCount"`,
          `(SELECT COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', e.id,
              'quantity', e.quantity,
              'price', e.price,
              'startTime', TO_CHAR(e."startTime", 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
              'createdAt', TO_CHAR(e."createdAt", 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
              'updatedAt', TO_CHAR(e."updatedAt", 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
              'product', JSON_BUILD_OBJECT(
                'id', p.id,
                'title', p.title,
                'description', COALESCE(p.description, null),
                'unitOfMeasurement', p."unitOfMeasurement",
                'materialType', p."materialType",
                'createdAt', TO_CHAR(p."createdAt", 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
                'updatedAt', TO_CHAR(p."updatedAt", 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
              )
            )
          ), '[]'
        ) FROM entry e LEFT JOIN product p ON e."productId" = p.id WHERE e."supplierId" = s.id) AS "entry"`,
        ])
        .where("s.id = :id", { id })
        .groupBy("s.id")
        .getRawOne();

      return result || null;
    } catch (error) {
      console.log("Error fetching supplier:", error);
      return null;
    }
  }

  @Mutation(() => SupplierResponse)
  async createSupplierRuc(
    @Arg("input") input: SupplierRuc
  ): Promise<SupplierResponse> {
    const { ruc } = input;

    if (!/^\d{11}$/.test(ruc)) {
      return {
        errors: [
          {
            field: "ruc",
            message: "RUC inválido, debe tener 11 caracteres numéricos.",
          },
        ],
      };
    }

    const apiUrl = `http://localhost:8080/ruc/${ruc}`;

    try {
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        const reniec = response.data;

        if (reniec.data) {
          const existingRuc = await Supplier.findOne({ where: { ruc } });

          if (existingRuc) {
            if (existingRuc.ruc === ruc) {
              return {
                errors: [
                  {
                    field: "duplicate",
                    message: `${existingRuc.id}`,
                  },
                ],
              };
            }
          }

          const supplier = Supplier.create({
            name: reniec.data["name"],
            ruc: reniec.data["ruc"],
            address:
              reniec.data["address"]?.length > 1
                ? reniec.data["address"]
                : null,
            district:
              reniec.data["district"]?.length > 1
                ? reniec.data["district"]
                : null,
            province:
              reniec.data["province"]?.length > 1
                ? reniec.data["province"]
                : null,
            department:
              reniec.data["department"]?.length > 1
                ? reniec.data["department"]
                : null,
          });

          await supplier.save();
          return { supplier };
        } else {
          return {
            errors: [
              {
                field: "ruc",
                message: "Número de RUC no encontrado.",
              },
            ],
          };
        }
      } else if (response.status === 422 || response.status === 404) {
        return {
          errors: [
            {
              field: "ruc",
              message: "RUC inválido, intenta nuevamente.",
            },
          ],
        };
      } else {
        return {
          errors: [
            {
              field: "ruc",
              message: `Error en la solicitud. Código de estado: ${response.status}`,
            },
          ],
        };
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 422 || error.response?.status === 404) {
          return {
            errors: [
              {
                field: "ruc",
                message: "RUC inválido, intenta nuevamente.",
              },
            ],
          };
        }
      }
      return {
        errors: [
          {
            field: "ruc",
            message: `Error en la solicitud: ${error.message}`,
          },
        ],
      };
    }
  }

  @Mutation(() => SupplierResponse)
  async createSupplier(
    @Arg("input") input: SupplierInput
  ): Promise<SupplierResponse> {
    const errors = validateSupplier(input);

    if (errors) {
      return { errors };
    }

    try {
      const existing = await Supplier.createQueryBuilder()
        .select("*")
        .from(Supplier, "c")
        .where("c.name ILIKE :name", { name: input.name })
        .orderBy("(SELECT NULL)")
        .offset(0)
        .limit(1)
        .getRawOne();

      if (existing instanceof Object && "id" in existing) {
        return {
          errors: [
            {
              field: "duplicate",
              message: `${existing.id}`,
            },
          ],
        };
      }

      const supplier = Supplier.create({
        name: input.name,
        address: input.address,
        district: input.district,
        province: input.province,
        department: input.department,
      });

      await supplier.save();

      return { supplier };
    } catch (e) {
      console.log("...", e);
      return {
        errors: [
          {
            field: "name",
            message: `...: ${e.message}`,
          },
        ],
      };
    }
  }

  @Mutation(() => Boolean)
  async deleteSupplier(@Arg("id", () => Int) id: number): Promise<boolean> {
    try {
      const supplier = await Supplier.findOne({ where: { id } });

      if (!supplier) {
        return false;
      }

      await supplier.remove();
      return true;
    } catch (e) {
      console.log("...", e);
      return false;
    }
  }
}
