import { DataSource } from "typeorm";
import { User } from "./schemas/user";
import { Withdrawal } from "./schemas/withdrawal";
import { Supplier } from "./schemas/supplier";
import { Product } from "./schemas/product";
import { Entry } from "./schemas/entry";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: "postgresql://postgres.dgjfsefvkvosvbgoqrfk:tRz9sTVmSe9WWRqF@aws-0-us-east-1.pooler.supabase.com:6543/postgres",
  logging: true,
  synchronize: true,
  entities: [User, Withdrawal, Supplier, Product, Entry],
});
