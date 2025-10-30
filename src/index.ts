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
import cors from "cors";

const main = async () => {
  await AppDataSource.initialize();

  const app = express();

  const RedisStore = require("connect-redis").default;

  const redis = new Redis({
    host: 'redis-16496.c278.us-east-1-4.ec2.redns.redis-cloud.com',
    port: 16496,
    password: '5SSp6uL3U1I6sTyawOCxg63CxmBWvuJo',
  });

  // Verificar conexión a Redis
  redis.on('connect', () => console.log('✅ Conectado a Redis'));
  redis.on('error', (err) => console.log('❌ Error Redis:', err));

  app.set("trust proxy", 1);
  
  // Middleware CORS explícito
  app.use(cors({
    origin: "https://catunta.netlify.app",
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  }));

  // Configuración de sesión mejorada
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
        sameSite: "none", // ← SIEMPRE "none" en producción
        secure: true, // ← SIEMPRE true en producción
        // domain: "catunta.netlify.app" // ← Prueba sin esto primero
      },
      saveUninitialized: false,
      secret: "pass", 
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

  // ✅ PUERTO CORRECTO PARA RAILWAY
  const PORT = process.env.PORT || 8080;
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 GraphQL: http://localhost:${PORT}/graphql`);
  });
};

main().catch((e) => console.log(e));