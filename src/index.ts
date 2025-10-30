import "reflect-metadata";
import express from "express";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import reniecRoute from "./api/reniec";
import sunatRoute from "./api/sunat";
import { AppDataSource } from "./config";
import { UserResolver } from "./resolvers/user.resolver";
import { COOKIE_NAME } from "./constants";
import session from "express-session";
import Redis from "ioredis";
import { ProductResolver } from "./resolvers/product.resolver";
import { EntryResolver } from "./resolvers/entry.resolver";
import { SupplierResolver } from "./resolvers/supplier.resolver";
import { WithdrawalResolver } from "./resolvers/withdrawal";

const main = async () => {
  await AppDataSource.initialize();

  const app = express();

  const RedisStore = require("connect-redis").default;

  const redis = new Redis({
    host: 'redis-16496.c278.us-east-1-4.ec2.redns.redis-cloud.com',
    port: 16496,
    password: '5SSp6uL3U1I6sTyawOCxg63CxmBWvuJo',
  });

  app.set("trust proxy", 1);
  app.set("Access-Control-Allow-Credentials", true);

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTTL: true,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.NODE_ENV === "production" ? ".catunta.netlify.app" : undefined,
      },
      saveUninitialized: false,
      secret: "pass", // ← ¡MEJORA ESTO!
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        UserResolver,
        ProductResolver,
        EntryResolver,
        SupplierResolver,
        WithdrawalResolver,
      ],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
    }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app: app as any,
    cors: {
      credentials: true,
      origin: "https://catunta.netlify.app",
    },
  });

  reniecRoute(app);
  sunatRoute(app);

  app.listen(8080, () => {
    console.log("On Servening... http://localhost:8080/graphql");
  });
};

main().catch((e) => console.log(e));