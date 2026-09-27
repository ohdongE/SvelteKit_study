import { PrismaClient } from '@prisma/client';

// dev 서버 HMR 시 PrismaClient가 계속 새로 생성되어 커넥션이 쌓이는 것 방지
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
