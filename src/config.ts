import { DataSource } from "typeorm";
import { User } from "./schemas/user";
import { Withdrawal } from "./schemas/withdrawal";
import { Supplier } from "./schemas/supplier";
import { Product } from "./schemas/product";
import { Entry } from "./schemas/entry";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: "postgresql://postgres.ufaelbayeikqixhjgwqv:gg74544019.@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
  logging: true,
  synchronize: true,
  entities: [User, Withdrawal, Supplier, Product, Entry],
});
