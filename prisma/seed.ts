import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

import { PrismaClient } from "../src/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type RoleName = "SUPER_ADMIN" | "FLEET_MANAGER" | "DRIVER" | "SAFETY_OFFICER" | "FINANCIAL_ANALYST";
type VehicleStatus = "AVAILABLE" | "ON_TRIP" | "IN_SHOP" | "RETIRED";
type DriverStatus = "AVAILABLE" | "ON_TRIP" | "OFF_DUTY" | "SUSPENDED";
type TripStatus = "DRAFT" | "DISPATCHED" | "COMPLETED" | "CANCELLED";
type MaintenanceStatus = "OPEN" | "CLOSED";

const roles: Array<{ name: RoleName; description: string }> = [
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
];

const demoUsers: Array<{ email: string; fullName: string; role: RoleName }> = [
  { email: "fleet@transitops.dev", fullName: "Rajesh Kumar", role: "FLEET_MANAGER" },
  { email: "safety@transitops.dev", fullName: "Priya Sharma", role: "SAFETY_OFFICER" },
  { email: "finance@transitops.dev", fullName: "Amit Patel", role: "FINANCIAL_ANALYST" },
  { email: "dispatcher@transitops.dev", fullName: "Neha Gupta", role: "FLEET_MANAGER" },
];

const vehicles: Array<{
  registrationNumber: string;
  model: string;
  type: string;
  maxLoadCapacity: number;
  odometer: number;
  acquisitionCost: number;
  status: VehicleStatus;
  region: string;
}> = [
  {
    registrationNumber: "MH12AB1234",
    model: "Tata Prima 4928.S",
    type: "Heavy Truck",
    maxLoadCapacity: 28000,
    odometer: 125000,
    acquisitionCost: 3500000,
    status: "AVAILABLE",
    region: "Maharashtra",
  },
  {
    registrationNumber: "KA01CD5678",
    model: "Ashok Leyland 4220",
    type: "Heavy Truck",
    maxLoadCapacity: 25000,
    odometer: 89156,
    acquisitionCost: 3200000,
    status: "AVAILABLE",
    region: "Karnataka",
  },
  {
    registrationNumber: "TN09EF9012",
    model: "BharatBenz 1617R",
    type: "Medium Truck",
    maxLoadCapacity: 16000,
    odometer: 45000,
    acquisitionCost: 2100000,
    status: "IN_SHOP",
    region: "Tamil Nadu",
  },
];

const drivers: Array<{
  fullName: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: Date;
  contactNumber: string;
  safetyScore: number;
  status: DriverStatus;
}> = [
  {
    fullName: "Suresh Yadav",
    licenseNumber: "MH1420210012345",
    licenseCategory: "HMV",
    licenseExpiry: new Date("2027-03-15"),
    contactNumber: "+919876543210",
    safetyScore: 95,
    status: "AVAILABLE",
  },
  {
    fullName: "Ramesh Patil",
    licenseNumber: "KA0520200098765",
    licenseCategory: "HMV",
    licenseExpiry: new Date("2026-11-30"),
    contactNumber: "+919876543211",
    safetyScore: 88,
    status: "AVAILABLE",
  },
];

const tripData: {
  source: string;
  destination: string;
  cargoWeight: number;
  plannedDistance: number;
  actualDistance: number;
  revenue: number;
  status: TripStatus;
  finalOdometer: number;
  dispatchedAt: Date;
  completedAt: Date;
} = {
  source: "Mumbai, Maharashtra",
  destination: "Pune, Maharashtra",
  cargoWeight: 18000,
  plannedDistance: 150,
  actualDistance: 156,
  revenue: 45000,
  status: "COMPLETED",
  finalOdometer: 89156,
  dispatchedAt: new Date("2026-07-10T06:00:00Z"),
  completedAt: new Date("2026-07-10T14:30:00Z"),
};

const maintenanceData: {
  description: string;
  cost: number;
  status: MaintenanceStatus;
  startedAt: Date;
} = {
  description: "Engine oil change, brake pad replacement, tire rotation",
  cost: 28500,
  status: "OPEN",
  startedAt: new Date("2026-07-11"),
};

const fuelLogData = {
  liters: 85,
  cost: 8925,
  logDate: new Date("2026-07-10"),
};

async function main() {
  console.log("Starting seed...");

  const roleRecords = new Map<RoleName, string>();

  for (const role of roles) {
    const record = await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: { name: role.name, description: role.description },
      select: { id: true, name: true },
    });

    roleRecords.set(record.name, record.id);
  }
  console.log(`Created or updated ${roles.length} roles.`);

  const adminEmail = process.env.SUPER_ADMIN_EMAIL ?? "admin@transitops.dev";
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD ?? "password123";
  const adminFullName = process.env.SUPER_ADMIN_FULL_NAME ?? "TransitOps Super Admin";
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
  const superAdminRoleId = roleRecords.get("SUPER_ADMIN");

  if (!superAdminRoleId) {
    throw new Error("SUPER_ADMIN role not found");
  }

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      fullName: adminFullName,
      hashedPassword: hashedAdminPassword,
      roleId: superAdminRoleId,
      isActive: true,
    },
    create: {
      email: adminEmail,
      fullName: adminFullName,
      hashedPassword: hashedAdminPassword,
      roleId: superAdminRoleId,
      isActive: true,
    },
  });
  console.log(`Created or updated super admin: ${adminEmail}`);

  const demoPassword = "demo123";
  const hashedDemoPassword = await bcrypt.hash(demoPassword, 10);
  const userRecords = new Map<string, string>();

  for (const user of demoUsers) {
    const roleId = roleRecords.get(user.role);
    if (!roleId) {
      throw new Error(`Role ${user.role} not found`);
    }

    const record = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        fullName: user.fullName,
        hashedPassword: hashedDemoPassword,
        roleId,
        isActive: true,
      },
      create: {
        email: user.email,
        fullName: user.fullName,
        hashedPassword: hashedDemoPassword,
        roleId,
        isActive: true,
      },
    });

    userRecords.set(user.email, record.id);
  }
  console.log(`Created or updated ${demoUsers.length} demo users.`);

  const vehicleRecords = new Map<string, string>();

  for (const vehicle of vehicles) {
    const record = await prisma.vehicle.upsert({
      where: { registrationNumber: vehicle.registrationNumber },
      update: {
        model: vehicle.model,
        type: vehicle.type,
        maxLoadCapacity: vehicle.maxLoadCapacity,
        odometer: vehicle.odometer,
        acquisitionCost: vehicle.acquisitionCost,
        status: vehicle.status,
        region: vehicle.region,
      },
      create: {
        registrationNumber: vehicle.registrationNumber,
        model: vehicle.model,
        type: vehicle.type,
        maxLoadCapacity: vehicle.maxLoadCapacity,
        odometer: vehicle.odometer,
        acquisitionCost: vehicle.acquisitionCost,
        status: vehicle.status,
        region: vehicle.region,
      },
    });

    vehicleRecords.set(vehicle.registrationNumber, record.id);
  }
  console.log(`Created or updated ${vehicles.length} vehicles.`);

  const driverRecords = new Map<string, string>();

  for (const driver of drivers) {
    const record = await prisma.driver.upsert({
      where: { licenseNumber: driver.licenseNumber },
      update: {
        fullName: driver.fullName,
        licenseCategory: driver.licenseCategory,
        licenseExpiry: driver.licenseExpiry,
        contactNumber: driver.contactNumber,
        safetyScore: driver.safetyScore,
        status: driver.status,
      },
      create: {
        fullName: driver.fullName,
        licenseNumber: driver.licenseNumber,
        licenseCategory: driver.licenseCategory,
        licenseExpiry: driver.licenseExpiry,
        contactNumber: driver.contactNumber,
        safetyScore: driver.safetyScore,
        status: driver.status,
      },
    });

    driverRecords.set(driver.licenseNumber, record.id);
  }
  console.log(`Created or updated ${drivers.length} drivers.`);

  const tripVehicleId = vehicleRecords.get("KA01CD5678");
  const tripDriverId = driverRecords.get("KA0520200098765");
  const tripCreatorId = userRecords.get("dispatcher@transitops.dev");

  if (!tripVehicleId || !tripDriverId || !tripCreatorId) {
    throw new Error("Missing required records for trip creation");
  }

  const existingTrip = await prisma.trip.findFirst({
    where: {
      vehicleId: tripVehicleId,
      driverId: tripDriverId,
      source: tripData.source,
      destination: tripData.destination,
      dispatchedAt: tripData.dispatchedAt,
    },
    select: { id: true },
  });

  const tripPayload = {
    vehicleId: tripVehicleId,
    driverId: tripDriverId,
    createdById: tripCreatorId,
    source: tripData.source,
    destination: tripData.destination,
    cargoWeight: tripData.cargoWeight,
    plannedDistance: tripData.plannedDistance,
    actualDistance: tripData.actualDistance,
    revenue: tripData.revenue,
    status: tripData.status,
    finalOdometer: tripData.finalOdometer,
    dispatchedAt: tripData.dispatchedAt,
    completedAt: tripData.completedAt,
  };

  const trip = existingTrip
    ? await prisma.trip.update({
        where: { id: existingTrip.id },
        data: tripPayload,
      })
    : await prisma.trip.create({
        data: tripPayload,
      });
  console.log("Created or updated completed demo trip.");

  const maintenanceVehicleId = vehicleRecords.get("TN09EF9012");
  if (!maintenanceVehicleId) {
    throw new Error("Missing vehicle for maintenance log");
  }

  const existingMaintenance = await prisma.maintenanceLog.findFirst({
    where: {
      vehicleId: maintenanceVehicleId,
      description: maintenanceData.description,
      startedAt: maintenanceData.startedAt,
    },
    select: { id: true },
  });

  const maintenancePayload = {
    vehicleId: maintenanceVehicleId,
    description: maintenanceData.description,
    cost: maintenanceData.cost,
    status: maintenanceData.status,
    startedAt: maintenanceData.startedAt,
  };

  if (existingMaintenance) {
    await prisma.maintenanceLog.update({
      where: { id: existingMaintenance.id },
      data: maintenancePayload,
    });
  } else {
    await prisma.maintenanceLog.create({
      data: maintenancePayload,
    });
  }
  console.log("Created or updated maintenance log.");

  const existingFuelLog = await prisma.fuelLog.findFirst({
    where: {
      vehicleId: tripVehicleId,
      tripId: trip.id,
      logDate: fuelLogData.logDate,
    },
    select: { id: true },
  });

  const fuelLogPayload = {
    vehicleId: tripVehicleId,
    tripId: trip.id,
    liters: fuelLogData.liters,
    cost: fuelLogData.cost,
    logDate: fuelLogData.logDate,
  };

  if (existingFuelLog) {
    await prisma.fuelLog.update({
      where: { id: existingFuelLog.id },
      data: fuelLogPayload,
    });
  } else {
    await prisma.fuelLog.create({
      data: fuelLogPayload,
    });
  }
  console.log("Created or updated fuel log.");

  console.log("Seed complete.");
  console.log("Demo credentials:");
  console.log(`Super Admin: ${adminEmail} / ${adminPassword}`);
  console.log(`Fleet Manager: fleet@transitops.dev / ${demoPassword}`);
  console.log(`Safety Officer: safety@transitops.dev / ${demoPassword}`);
  console.log(`Financial Analyst: finance@transitops.dev / ${demoPassword}`);
  console.log(`Dispatcher: dispatcher@transitops.dev / ${demoPassword}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
