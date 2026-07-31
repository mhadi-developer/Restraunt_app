import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
import userRoutes from "./src/routes/user.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import { connectRedis } from "./src/config/redisClient.js";
const port = process.env.PORT || 7000;

const corsOption = {
  origin: [`${process.env.CLIENT_URL}`, `${process.env.ADMIN_URL}`],
  credentials: true,
};
app.use(cookieParser());
app.use(cors(corsOption));
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", adminRoutes);
const startServer = async(port) => {
  await connectRedis();
  app.listen(port, () => {
    console.log(`server started on Port:${port}`);
    console.log(`${process.env.DATABASE_URL}`);
  });
}

startServer(port);