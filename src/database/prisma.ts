import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient({
  log: process.env.NODE_ENV === "production" ? [] : ["query"],
});

export const prisma = prismaClient.$extends({
  query: {
    user: {
      async findMany({ args, query }) {
        const result = await query(args);

        return result.map(user => ({
          ...user,
          password: undefined,
        }));
      },

      async findUnique({ args, query }) {
        const user = await query(args);

        if (!user) return user;

        return {
          ...user,
          password: undefined,
        };
      },
    },
  },
});
