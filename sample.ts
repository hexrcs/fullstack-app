import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const sam = await prisma.profile.create({
    data: { name: "Sam" },
  });
  console.log(sam);

  await prisma.disconnect();
}

main();
