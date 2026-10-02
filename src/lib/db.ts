import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// Vercel Serverless Writable SQLite Bridge
if (process.env.VERCEL) {
  try {
    const cwd = process.cwd();
    const sourceCandidates = [
      path.join(cwd, "prisma", "dev.db"),
      path.join(cwd, "dev.db"),
    ];
    const tmpDbPath = "/tmp/dev.db";
    const tmpDir = path.dirname(tmpDbPath);

    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    if (!fs.existsSync(tmpDbPath)) {
      for (const src of sourceCandidates) {
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, tmpDbPath);
          break;
        }
      }
    }

    if (fs.existsSync(tmpDbPath)) {
      process.env.DATABASE_URL = "file:/tmp/dev.db";
    }
  } catch (err) {
    console.error("Vercel tmp db setup error:", err);
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: process.env.VERCEL
      ? {
          db: {
            url: "file:/tmp/dev.db",
          },
        }
      : undefined,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
