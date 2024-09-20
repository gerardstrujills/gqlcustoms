import { DataSource } from "typeorm";
import { User } from "./schemas/user";
import { Withdrawal } from "./schemas/withdrawal";
import { Supplier } from "./schemas/supplier";
import { Product } from "./schemas/product";
import { Entry } from "./schemas/entry";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: "postgresql://postgres:2207@localhost:5432/customs",
  logging: true,
  synchronize: true,
  entities: [User, Withdrawal, Supplier, Product, Entry],
});
