import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

import { PrismaClient } from "../src/generated/prisma/client";

type RoleName = "SUPER_ADMIN" | "FLEET_MANAGER" | "DRIVER" | "SAFETY_OFFICER" | "FINANCIAL_ANALYST";
type VehicleStatus = "AVAILABLE" | "ON_TRIP" | "IN_SHOP" | "RETIRED";
type DriverStatus = "AVAILABLE" | "ON_TRIP" | "OFF_DUTY" | "SUSPENDED";
type TripStatus = "DRAFT" | "DISPATCHED" | "COMPLETED" | "CANCELLED";
type MaintenanceStatus = "OPEN" | "CLOSED";
type ExpenseCategory =
  | "TOLL"
  | "PERMIT"
  | "INSURANCE"
  | "FINE"
  | "PARKING"
  | "MAINTENANCE"
  | "OTHER";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Deterministic RNG so re-running the seed produces the same dataset.
// ---------------------------------------------------------------------------
function createRng(seed: number) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;

  return {
    next(): number {
      state = (state * 16807) % 2147483647;
      return state / 2147483647;
    },
    int(min: number, max: number): number {
      return Math.floor(this.next() * (max - min + 1)) + min;
    },
    pick<T>(items: readonly T[]): T {
      return items[this.int(0, items.length - 1)];
    },
  };
}

const rng = createRng(42);

// ---------------------------------------------------------------------------
// Reference data
// ---------------------------------------------------------------------------
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
  { email: "driver@transitops.dev", fullName: "Ravi Menon", role: "DRIVER" },
];

const regions = [
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Gujarat",
  "Delhi",
  "Rajasthan",
  "Kerala",
  "Telangana",
  "West Bengal",
  "Punjab",
];

const stateCodes = ["MH", "KA", "TN", "GJ", "DL", "RJ", "KL", "TS", "WB", "PB"];

const vehicleModels: Array<{ model: string; type: string; capacity: number; cost: number }> = [
  { model: "Tata Prima 4928.S", type: "Heavy Truck", capacity: 28000, cost: 3500000 },
  { model: "Ashok Leyland 4220", type: "Heavy Truck", capacity: 25000, cost: 3200000 },
  { model: "BharatBenz 1617R", type: "Medium Truck", capacity: 16000, cost: 2100000 },
  { model: "Mahindra Blazo X 28", type: "Heavy Truck", capacity: 26000, cost: 3000000 },
  { model: "Eicher Pro 6055", type: "Medium Truck", capacity: 12000, cost: 1800000 },
  { model: "Volvo FH 460", type: "Heavy Truck", capacity: 34000, cost: 5500000 },
  { model: "Tata Ace Gold", type: "Light Truck", capacity: 750, cost: 550000 },
  { model: "Mahindra Bolero Pickup", type: "Light Truck", capacity: 1500, cost: 850000 },
  { model: "Scania R 500", type: "Heavy Truck", capacity: 40000, cost: 7500000 },
  { model: "Force Traveller", type: "Passenger Van", capacity: 3000, cost: 1500000 },
];

const vehicleStatusPool: VehicleStatus[] = [
  "AVAILABLE",
  "AVAILABLE",
  "AVAILABLE",
  "AVAILABLE",
  "AVAILABLE",
  "ON_TRIP",
  "ON_TRIP",
  "IN_SHOP",
  "IN_SHOP",
  "RETIRED",
];

const licenseCategories = ["HMV", "LMV", "MCWG"] as const;

const driverFirstNames = [
  "Aarav",
  "Vihaan",
  "Aditya",
  "Kabir",
  "Reyansh",
  "Ishaan",
  "Arjun",
  "Rohan",
  "Kunal",
  "Suresh",
  "Ramesh",
  "Vikram",
  "Rahul",
  "Manoj",
  "Sandeep",
  "Deepak",
  "Ankit",
  "Yash",
  "Nikhil",
  "Amit",
  "Shivam",
  "Piyush",
  "Anand",
  "Rakesh",
  "Naveen",
];

const driverLastNames = [
  "Sharma",
  "Verma",
  "Yadav",
  "Patil",
  "Reddy",
  "Iyer",
  "Menon",
  "Nair",
  "Gupta",
  "Singh",
  "Chauhan",
  "Kumar",
  "Bansal",
  "Chopra",
  "Kapoor",
  "Bhandari",
  "Bhattacharya",
  "Rathore",
  "Deshmukh",
  "Pillai",
];

const driverStatusPool: DriverStatus[] = [
  "AVAILABLE",
  "AVAILABLE",
  "AVAILABLE",
  "AVAILABLE",
  "AVAILABLE",
  "AVAILABLE",
  "ON_TRIP",
  "OFF_DUTY",
  "SUSPENDED",
];

const citiesByRegion: Record<string, string[]> = {
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
  Karnataka: ["Bengaluru", "Mysuru", "Mangaluru"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
  Delhi: ["New Delhi", "Dwarka", "Rohini"],
  Rajasthan: ["Jaipur", "Udaipur", "Jodhpur"],
  Kerala: ["Kochi", "Thiruvananthapuram", "Kozhikode"],
  Telangana: ["Hyderabad", "Warangal"],
  "West Bengal": ["Kolkata", "Siliguri"],
  Punjab: ["Ludhiana", "Amritsar", "Chandigarh"],
};

const expenseCategories: ExpenseCategory[] = [
  "TOLL",
  "PERMIT",
  "INSURANCE",
  "FINE",
  "PARKING",
  "MAINTENANCE",
  "OTHER",
];

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------
function pad(value: number, size: number): string {
  return value.toString().padStart(size, "0");
}

function generateVehicles(count: number) {
  const items: Array<{
    registrationNumber: string;
    model: string;
    type: string;
    maxLoadCapacity: number;
    odometer: number;
    acquisitionCost: number;
    status: VehicleStatus;
    region: string;
  }> = [];

  for (let index = 0; index < count; index += 1) {
    const regionIndex = index % regions.length;
    const region = regions[regionIndex];
    const stateCode = stateCodes[regionIndex];
    const modelSpec = rng.pick(vehicleModels);
    const registrationNumber = `${stateCode}${pad(rng.int(10, 99), 2)}${String.fromCharCode(
      65 + rng.int(0, 25),
    )}${String.fromCharCode(65 + rng.int(0, 25))}${pad(index + 1000, 4)}`;

    items.push({
      registrationNumber,
      model: modelSpec.model,
      type: modelSpec.type,
      maxLoadCapacity: modelSpec.capacity,
      odometer: rng.int(10000, 250000),
      acquisitionCost: modelSpec.cost,
      status: vehicleStatusPool[index % vehicleStatusPool.length],
      region,
    });
  }

  return items;
}

function generateDrivers(count: number) {
  const usedLicenses = new Set<string>();
  const items: Array<{
    fullName: string;
    licenseNumber: string;
    licenseCategory: string;
    licenseExpiry: Date;
    contactNumber: string;
    safetyScore: number;
    status: DriverStatus;
  }> = [];

  for (let index = 0; index < count; index += 1) {
    const firstName = rng.pick(driverFirstNames);
    const lastName = rng.pick(driverLastNames);
    let licenseNumber = "";

    do {
      const stateCode = stateCodes[index % stateCodes.length];
      licenseNumber = `${stateCode}${pad(rng.int(10, 99), 2)}${pad(2018 + rng.int(0, 6), 4)}${pad(index * 7 + rng.int(1, 999), 7)}`;
    } while (usedLicenses.has(licenseNumber));
    usedLicenses.add(licenseNumber);

    const expiryYear = 2026 + rng.int(0, 4);
    const expiryMonth = rng.int(1, 12);
    const expiryDay = rng.int(1, 28);

    items.push({
      fullName: `${firstName} ${lastName}`,
      licenseNumber,
      licenseCategory: rng.pick(licenseCategories),
      licenseExpiry: new Date(`${expiryYear}-${pad(expiryMonth, 2)}-${pad(expiryDay, 2)}`),
      contactNumber: `+9198${pad(rng.int(10000000, 99999999), 8)}`,
      safetyScore: rng.int(60, 100),
      status: driverStatusPool[index % driverStatusPool.length],
    });
  }

  return items;
}

function pickCityPair() {
  const region = rng.pick(regions);
  const cities = citiesByRegion[region];
  const source = rng.pick(cities);
  let destination = rng.pick(cities);
  while (cities.length > 1 && destination === source) {
    destination = rng.pick(cities);
  }
  return { region, source: `${source}, ${region}`, destination: `${destination}, ${region}` };
}

// ---------------------------------------------------------------------------
// Main seed
// ---------------------------------------------------------------------------
async function main() {
  console.log("Starting TransitOps seed...");

  console.log("Clearing previous demo data...");
  await prisma.expense.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();

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
  console.log(`Roles: ${roles.length}`);

  const adminEmail = process.env.SUPER_ADMIN_EMAIL ?? "admin@transitops.dev";
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD ?? "password123";
  const adminFullName = process.env.SUPER_ADMIN_FULL_NAME ?? "TransitOps Super Admin";
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

  const superAdminRoleId = roleRecords.get("SUPER_ADMIN");
  if (!superAdminRoleId) throw new Error("SUPER_ADMIN role not found");

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

  await prisma.appSetting.upsert({
    where: { scope: "GLOBAL" },
    update: {
      depotName: "TransitOps Central Depot",
      currency: "INR",
      distanceUnit: "kilometers",
    },
    create: {
      scope: "GLOBAL",
      depotName: "TransitOps Central Depot",
      currency: "INR",
      distanceUnit: "kilometers",
    },
  });

  const demoPassword = "demo123";
  const hashedDemoPassword = await bcrypt.hash(demoPassword, 10);
  const userRecords = new Map<string, string>();
  userRecords.set(adminEmail, (await prisma.user.findUnique({ where: { email: adminEmail } }))!.id);

  for (const user of demoUsers) {
    const roleId = roleRecords.get(user.role);
    if (!roleId) throw new Error(`Role ${user.role} not found`);

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
      select: { id: true },
    });
    userRecords.set(user.email, record.id);
  }
  console.log(`Users: ${demoUsers.length + 1}`);

  const vehicleSpecs = generateVehicles(100);
  const vehicleIds: string[] = [];
  for (const vehicle of vehicleSpecs) {
    const record = await prisma.vehicle.create({
      data: vehicle,
      select: { id: true },
    });
    vehicleIds.push(record.id);
  }
  console.log(`Vehicles: ${vehicleSpecs.length}`);

  const driverSpecs = generateDrivers(100);
  const driverIds: string[] = [];
  for (const driver of driverSpecs) {
    const record = await prisma.driver.create({
      data: driver,
      select: { id: true },
    });
    driverIds.push(record.id);
  }
  console.log(`Drivers: ${driverSpecs.length}`);

  const dispatcherId = userRecords.get("dispatcher@transitops.dev");
  if (!dispatcherId) throw new Error("Dispatcher user missing");

  const availableVehicleIds = vehicleSpecs
    .map((vehicle, index) => ({ vehicle, id: vehicleIds[index] }))
    .filter((item) => item.vehicle.status === "AVAILABLE")
    .map((item) => item.id);
  const availableDriverIds = driverSpecs
    .map((driver, index) => ({ driver, id: driverIds[index] }))
    .filter((item) => item.driver.status === "AVAILABLE")
    .map((item) => item.id);

  const tripCount = 25;
  const tripIds: string[] = [];
  for (let index = 0; index < tripCount; index += 1) {
    const vehicleId = availableVehicleIds[index % availableVehicleIds.length];
    const driverId = availableDriverIds[index % availableDriverIds.length];
    if (!vehicleId || !driverId) continue;

    const cityPair = pickCityPair();
    const planned = rng.int(80, 900);
    const daysAgo = rng.int(1, 45);
    const dispatchedAt = new Date();
    dispatchedAt.setDate(dispatchedAt.getDate() - daysAgo);
    const completedAt = new Date(dispatchedAt);
    completedAt.setHours(completedAt.getHours() + rng.int(6, 18));

    const trip = await prisma.trip.create({
      data: {
        vehicleId,
        driverId,
        createdById: dispatcherId,
        source: cityPair.source,
        destination: cityPair.destination,
        cargoWeight: rng.int(500, 20000),
        plannedDistance: planned,
        actualDistance: planned + rng.int(-15, 30),
        revenue: rng.int(20000, 120000),
        status: "COMPLETED" as TripStatus,
        finalOdometer: rng.int(20000, 250000),
        dispatchedAt,
        completedAt,
      },
      select: { id: true },
    });
    tripIds.push(trip.id);
  }
  console.log(`Trips: ${tripIds.length}`);

  const maintenanceCount = 20;
  for (let index = 0; index < maintenanceCount; index += 1) {
    const vehicleId = vehicleIds[rng.int(0, vehicleIds.length - 1)];
    const startedAt = new Date();
    startedAt.setDate(startedAt.getDate() - rng.int(1, 90));
    const status: MaintenanceStatus = rng.int(0, 1) === 0 ? "OPEN" : "CLOSED";

    await prisma.maintenanceLog.create({
      data: {
        vehicleId,
        description: rng.pick([
          "Engine oil change",
          "Brake pad replacement",
          "Tire rotation and balancing",
          "Coolant flush and refill",
          "Battery replacement",
          "Suspension inspection",
          "Air filter replacement",
          "Transmission service",
        ]),
        cost: rng.int(2500, 45000),
        status,
        startedAt,
        completedAt: status === "CLOSED" ? new Date(startedAt.getTime() + 86400000) : null,
      },
    });
  }
  console.log(`Maintenance logs: ${maintenanceCount}`);

  const fuelCount = 40;
  for (let index = 0; index < fuelCount; index += 1) {
    const vehicleId = vehicleIds[rng.int(0, vehicleIds.length - 1)];
    const tripId = tripIds.length ? rng.pick(tripIds) : null;
    const logDate = new Date();
    logDate.setDate(logDate.getDate() - rng.int(1, 60));

    await prisma.fuelLog.create({
      data: {
        vehicleId,
        tripId,
        liters: rng.int(40, 220),
        cost: rng.int(4000, 22000),
        logDate,
      },
    });
  }
  console.log(`Fuel logs: ${fuelCount}`);

  const expenseCount = 50;
  for (let index = 0; index < expenseCount; index += 1) {
    const vehicleId = vehicleIds[rng.int(0, vehicleIds.length - 1)];
    const expenseDate = new Date();
    expenseDate.setDate(expenseDate.getDate() - rng.int(1, 60));

    await prisma.expense.create({
      data: {
        vehicleId,
        category: rng.pick(expenseCategories),
        amount: rng.int(300, 12000),
        expenseDate,
        description: rng.pick([
          "Toll booth on NH-48",
          "State permit renewal",
          "Insurance premium",
          "Traffic fine",
          "Parking fee",
          "Roadside assistance",
          "Miscellaneous operational cost",
        ]),
      },
    });
  }
  console.log(`Expenses: ${expenseCount}`);

  console.log("");
  console.log("Seed complete.");
  console.log("--------------------------------------------------");
  console.log("Demo credentials:");
  console.log(`  Super Admin:       ${adminEmail} / ${adminPassword}`);
  console.log(`  Fleet Manager:     fleet@transitops.dev / ${demoPassword}`);
  console.log(`  Dispatcher:        dispatcher@transitops.dev / ${demoPassword}`);
  console.log(`  Safety Officer:    safety@transitops.dev / ${demoPassword}`);
  console.log(`  Financial Analyst: finance@transitops.dev / ${demoPassword}`);
  console.log(`  Driver:            driver@transitops.dev / ${demoPassword}`);
  console.log("--------------------------------------------------");
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
