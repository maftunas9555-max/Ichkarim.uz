import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL!;
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter } as any);
};

declare global {
  var prisma: undefined | ReturnType<typeof createPrismaClient>;
}

const prisma = globalThis.prisma ?? createPrismaClient();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
