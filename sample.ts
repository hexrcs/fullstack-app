import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // await prisma.profile.create({ data: { name: "Alice" } });
  // await prisma.profile.create({ data: { name: "Alex" } });
  // const entries = await prisma.profile.findMany({
  //   where: { name: { contains: "A" } },
  // });
  // console.log(entries);

  // const secondEntry = await prisma.profile.update({
  //   where: { id: 2 },
  //   data: { name: "Bob" },
  // });
  // console.log(secondEntry);

  // await prisma.profile.updateMany({
  //   where: { name: { contains: "A" } },
  //   data: { name: "**REDACTED**" },
  // });
  // const entries = await prisma.profile.findMany({});
  // console.log(entries);

  const { count } = await prisma.profile.deleteMany({});
  console.log(count + " entries deleted");

  await prisma.disconnect();
}

main();
