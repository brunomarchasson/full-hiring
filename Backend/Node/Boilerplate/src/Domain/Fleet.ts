import { Vehicle } from './Vehicle';

export interface FleetVehicle {
    vehicle: Vehicle
    location?: string
}

export class Fleet {
  vehicles: Map<string, FleetVehicle> = new Map();

  constructor(public id: string, initialVehicles: Array<{vehicle: Vehicle, location?: string}> = []) {
    initialVehicles.forEach(({ vehicle, location }) => {
      this.vehicles.set(vehicle.id, { vehicle, location });
    })
  }

  registerVehicle(vehicle: Vehicle): void {
    if (this.vehicles.has(vehicle.id)) {
      throw new Error("This vehicle has already been registered in your fleet.");
    }
    this.vehicles.set(vehicle.id, { vehicle });
  }

  parkVehicle(vehicle: Vehicle, location: string): void {
    if (!this.isVehicleInFleet(vehicle)) {
      throw new Error("This vehicle is not registered in your fleet.");
    }
    if (this.vehicles.get(vehicle.id)?.location === location) {
      throw new Error("This vehicle is already parked at this location.");
    }
    this.vehicles.set(vehicle.id, { vehicle, location });
  }

  getVehicleLocation(vehicle: Vehicle): string | undefined {
    return this.vehicles.get(vehicle.id)?.location;
  }

  isVehicleInFleet(vehicle: Vehicle): boolean {
    return this.vehicles.has(vehicle.id);
  }
}
