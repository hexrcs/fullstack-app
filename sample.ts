import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tom = await prisma.user.create({
    data: {
      profile: {
        create: {
          name: "Tom",
        },
      },
      posts: {
        create: [
          { content: "Hello World" },
          { content: "It's me again" },
          { content: "This is awesome!" },
        ],
      },
    },
  });
  console.log(tom); // prints out something like `{id: 1}`

  const postsByTom = await prisma.post.findMany({
    where: {
      author: {
        profile: {
          name: { equals: "Tom" },
        },
      },
    },
  });
  console.log(postsByTom);

  await prisma.$disconnect();
}

main();
