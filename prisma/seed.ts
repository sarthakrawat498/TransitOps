import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

async function main() {
  const email = "demo@mainevent.dev";
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      name: "Demo User",
      hashedPassword,
    },
    create: {
      email,
      name: "Demo User",
      hashedPassword,
    },
  });

  console.log("Seed complete:", { email, password });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
