import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

const roles = [
  {
    name: "SUPER_ADMIN",
    description: "Full platform administrator with access to user and role management.",
  },
  {
    name: "FLEET_MANAGER",
    description: "Manages fleet assets, vehicle lifecycle, maintenance, and utilization.",
  },
  {
    name: "DRIVER",
    description: "Operational driver role for trip visibility and assigned work.",
  },
  {
    name: "SAFETY_OFFICER",
    description: "Tracks driver compliance, license validity, and safety performance.",
  },
  {
    name: "FINANCIAL_ANALYST",
    description: "Reviews fuel, maintenance, expense, profitability, and ROI reports.",
  },
] as const;

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL ?? "admin@transitops.dev";
  const password = process.env.SUPER_ADMIN_PASSWORD ?? "password123";
  const fullName = process.env.SUPER_ADMIN_FULL_NAME ?? "TransitOps Super Admin";
  const hashedPassword = await bcrypt.hash(password, 10);

  const roleRecords = new Map<string, { id: string }>();

  for (const role of roles) {
    const roleRecord = await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
      select: { id: true, name: true },
    });

    roleRecords.set(roleRecord.name, { id: roleRecord.id });
  }

  const superAdminRole = roleRecords.get("SUPER_ADMIN");
  if (!superAdminRole) {
    throw new Error("SUPER_ADMIN role was not seeded");
  }

  await prisma.user.upsert({
    where: { email },
    update: {
      fullName,
      hashedPassword,
      roleId: superAdminRole.id,
      isActive: true,
    },
    create: {
      email,
      fullName,
      hashedPassword,
      roleId: superAdminRole.id,
      isActive: true,
    },
  });

  console.log("Seed complete:", {
    roles: roles.map((role) => role.name),
    superAdmin: { email, password },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
