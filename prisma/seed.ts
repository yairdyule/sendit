import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  //no worries if tables don't exist yet
  await prisma.user.deleteMany({}).catch(() => {});
  await prisma.queue.deleteMany({}).catch(() => {});
  await prisma.song.deleteMany({}).catch(() => {});

  const user0Email = "j@j.com";
  const user1Email = "a@a.com";
  const user0Password = await bcrypt.hash("arstneio", 10);
  const user1Password = await bcrypt.hash("arstneio", 10);

  const user0 = await prisma.user.create({
    data: {
      email: user0Email,
      password: {
        create: {
          hash: user0Password,
        },
      },
    },
  });

  const user1 = await prisma.user.create({
    data: {
      email: user1Email,
      password: {
        create: {
          hash: user1Password,
        },
      },
    },
  });

  await prisma.queue.create({
    data: {
      title: "some songs",
      description: "that i enjoyed and waneted to send to you",
      exported_yet: false,
      authorId: user0.id,
      recipientId: user1.id,
    },
  });

  await prisma.queue.create({
    data: {
      title: "other songs",
      description: "that i enjoy a lot",
      exported_yet: false,
      authorId: user0.id,
      recipientId: user1.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user0.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user0.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
