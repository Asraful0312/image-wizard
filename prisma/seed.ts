// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.coupon.createMany({
    data: [
      { code: "BONGO-BOLTU", credits: 50, expiresAt: new Date("2025-12-31") },
      { code: "RAYHAN-KHAN", credits: 25, expiresAt: new Date("2025-06-30") },
    ],
  });
  console.log("Seeded coupons");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
