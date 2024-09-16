import { Supplier } from "../schemas/supplier";
import { EntryInput } from "../res/entry";
import { Entry } from "../schemas/entry";
import { validateEntry } from "../validator/entry";
import {
  Arg,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";

@ObjectType()
class EntryFieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class EntryResponse {
  @Field(() => [EntryFieldError], { nullable: true })
  errors?: EntryFieldError[];

  @Field(() => Entry, { nullable: true })
  entry?: Entry;
}

@Resolver(Entry)
export class EntryResolver {
  @Query(() => [Entry], { nullable: true })
  async entries(): Promise<Entry[] | null> {
    try {
      const entry = await Entry.find({
        order: {
          createdAt: "DESC",
        },
      });
      return entry || null;
    } catch (e) {
      console.log("entries:", e);
      return null;
    }
  }

  @Mutation(() => EntryResponse)
  async createEntry(@Arg("input") input: EntryInput): Promise<EntryResponse> {
    const errors = validateEntry(input);

    if (errors) {
      return { errors };
    }

    try {
      const supplier = await Supplier.findOne({ where: { ruc: input.ruc } });

      if (!supplier) {
        return {
          errors: [
            {
              field: "ruc",
              message: "Ruc no existente..",
            },
          ],
        };
      }

      const query = await Entry.createQueryBuilder("e")
        .where(
          `"e"."productId" = :productId AND "e"."supplierId" = :supplierId AND "e"."quantity" = :quantity AND "e"."price" = :price AND "e"."startTime" = :startTime`,
          {
            productId: input.productId,
            supplierId: supplier.id,
            quantity: input.quantity,
            price: input.price,
            startTime: input.startTime,
          }
        )
        .orderBy("e.id", "ASC")
        .limit(1)
        .getRawOne();

      if (query) {
        return {
          errors: [
            {
              field: "ruc",
              message: "Producto entrada se ha creado anteriormente",
            },
          ],
        };
      }

      const entry = Entry.create({
        productId: input.productId,
        supplierId: supplier.id,
        price: input.price,
        quantity: input.quantity,
        startTime: input.startTime,
      });
      await entry.save();

      return { entry };
    } catch (e) {
      console.log(e);
      return {
        errors: [
          {
            field: "ruc",
            message: "Ocurrió un error al crear la entrada.",
          },
        ],
      };
    }
  }

  @Mutation(() => EntryResponse)
  async updateEntry(
    @Arg("id") id: number,
    @Arg("input") input: EntryInput
  ): Promise<EntryResponse> {
    const errors = validateEntry(input);

    if (errors) {
      return { errors };
    }

    try {
      const existing = await Entry.findOne({ where: { id } });
      if (!existing) {
        return {
          errors: [
            {
              field: "id",
              message: "Producto entrada no existente",
            },
          ],
        };
      }

      const duplicateEntry = await Entry.createQueryBuilder("e")
        .where(
          `"e"."productId" = :productId AND "e"."supplierId" = :supplierId AND quantity = :quantity AND "e"."price" = :price AND "e"."startTime" = :startTime AND "e"."id" != :id`,
          {
            productId: input.startTime,
            supplierId: input.startTime,
            quantity: input.startTime,
            price: input.startTime,
            startTime: input.startTime,
            id,
          }
        )
        // .where(`"p"."id" != :id`, {
        //   id,
        // })
        .getOne();

      if (duplicateEntry) {
        return {
          errors: [
            {
              field: "title",
              message: "Producto entrada se ha creado anteriormente",
            },
          ],
        };
      }

      Object.assign(existing, input);
      await existing.save();

      return { entry: existing };
    } catch (e) {
      console.log(e);
      return {
        errors: [
          {
            field: "title",
            message: `"Hubo un problema al actualizar el Entryo: ${e.message}"`,
          },
        ],
      };
    }
  }

  @Mutation(() => Boolean)
  async deleteEntry(@Arg("id", () => Int) id: number) {
    try {
      const entry = await Entry.findOne({
        where: { id },
      });

      if (!entry) {
        return false;
      }

      await entry.remove();
      return true;
    } catch (e) {
      console.log("Error deleted entry and Quote", e);
      return false;
    }
  }
}
