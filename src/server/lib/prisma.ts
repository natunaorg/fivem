import { PrismaClient } from "@prisma/client";
const Prisma = new PrismaClient();

// Check first connection
Prisma.$connect().catch((err) => {
    throw new Error(err);
});

export default Prisma;
