import type { TripListFilters } from "@/server/modules/trips/trips.types";
import * as tripsRepository from "@/server/modules/trips/trips.repository";

export async function getTrips(filters: TripListFilters) {
  return tripsRepository.findTrips(filters);
}

export async function getTripCount(filters: TripListFilters) {
  return tripsRepository.countTrips(filters);
}

export async function getTripById(id: string) {
  return tripsRepository.findTripById(id);
}

export async function getVehicleById(id: string) {
  return tripsRepository.findVehicleById(id);
}

export async function getDriverById(id: string) {
  return tripsRepository.findDriverById(id);
}

export async function getAvailableVehicles() {
  return tripsRepository.findAvailableVehicles();
}

export async function getAvailableDrivers() {
  return tripsRepository.findAvailableDrivers();
}
