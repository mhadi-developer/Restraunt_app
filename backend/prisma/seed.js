import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import argon2 from "argon2";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing.");
}

if (!process.env.ADMIN_PASSWORD) {
  throw new Error("ADMIN_PASSWORD is missing.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function main() {
  const hashedPassword = await argon2.hash(process.env.ADMIN_PASSWORD);

  const admin = await prisma.admin.upsert({
    where: {
      adminEmail: process.env.ADMIN_EMAIL,
    },

    update: {
      adminName: process.env.ADMIN_NAME,
      adminPassword: hashedPassword,
    },

    create: {
      adminEmail: process.env.ADMIN_EMAIL,
      adminName: process.env.ADMIN_NAME,
      adminPassword: hashedPassword,
    },
  });

  console.log(`✅ Admin seeded: ${admin.adminEmail}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
