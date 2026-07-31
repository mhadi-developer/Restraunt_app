import { createClient } from "redis";

export const redis = createClient({
  socket: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
  },
  password: process.env.REDIS_PASSWORD || undefined,
});

redis.on("error", (err) => {
  console.error("❌ Redis Error:", err.message);
});

redis.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

export const connectRedis = async () => {
  if (!redis.isOpen) {
    await redis.connect();
  }
};
