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
    host: 'redis-18468.c89.us-east-1-3.ec2.redns.redis-cloud.com',
    port: 18468,
    password: "uEZIYvAuLLOdZlzeCP1Srn4hjVmhN61l",
  });

  // Configuración para producción
  const isProduction = process.env.NODE_ENV === 'production';
  const origin = isProduction
    ? "https://catunta.netlify.app"
    : "http://localhost:3000"; // o tu frontend local

  app.set("trust proxy", 1); // Importante para HTTPS en producción
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
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 años
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax", // "none" para cross-site en producción
        secure: isProduction, // true en producción, false en desarrollo
        domain: isProduction ? ".catunta.netlify.app" : undefined, // Opcional: para subdominios
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "pass", // Usa variable de entorno en producción
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
      redis,
    }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app: app as any,
    cors: {
      credentials: true,
      origin: origin, // Usa la variable dinámica
    },
  });

  reniecRoute(app);
  sunatRoute(app);

  const PORT = process.env.PORT || 8080;

  app.listen(PORT, () => {
    console.log(`Server running in ${isProduction ? 'production' : 'development'} mode`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}${apolloServer.graphqlPath}`);
  });
};

main().catch((e) => console.log(e));