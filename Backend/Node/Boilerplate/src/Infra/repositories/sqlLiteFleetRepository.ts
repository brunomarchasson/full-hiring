import { Fleet } from "../../Domain/Fleet";
import { Vehicle } from "../../Domain/Vehicle";
import { db } from "../database";
import { IFleetReadRepository, IFleetWriteRepository } from "./FleetRepository";
import { v4 as uuidv4 } from 'uuid';

type rawfleetData = {
  id: string
  vehicles: Array<{ id: string, location: string}>
}
type rawVehicleData =  {
  fleet_id: string
  vehicle_id: string
  location: string
}
export class SQLiteFleetRepository implements IFleetWriteRepository, IFleetReadRepository {
  private fleets: Map<string, Fleet> = new Map();
  
  addFleet(fleet: Fleet): void {
    const stmt = db.prepare('INSERT INTO fleets (id) VALUES (?)');
    stmt.run(fleet.id);
  }

  fleetExists(fleetId: string): boolean {
    const fleetData = db.prepare('SELECT id FROM fleets WHERE id = ?').get(fleetId);
    return !!fleetData;
  }

  upsertVehicles(fleet: Fleet): void {
    const deleteStmt = db.prepare('DELETE FROM fleet_vehicles WHERE fleet_id = ?');
    deleteStmt.run(fleet.id);

    const insertStmt = db.prepare('INSERT INTO fleet_vehicles (id, fleet_id, vehicle_id, location) VALUES (?, ?, ?, ?)');
    for (const { vehicle, location } of Array.from(fleet.vehicles.values())) {
      insertStmt.run(uuidv4(), fleet.id, vehicle.id, location);
    }
  }

  save(fleet: Fleet): void {
    const existingFleet = this.fleetExists(fleet.id);
    if (!existingFleet) {
      this.addFleet(fleet);
    } 
    this.upsertVehicles(fleet);
  }

  getFleetById(fleetId: string): Fleet | undefined {
    const fleetData = db.prepare<string,rawfleetData>('SELECT * FROM fleets WHERE id = ?').get(fleetId)
    if(!fleetData) return undefined

    const vehiclesData = db.prepare<string,rawVehicleData>('SELECT * FROM fleet_vehicles WHERE fleet_id = ?').all(fleetId)
    const vehicles = vehiclesData.map(v => ({ vehicle: new Vehicle(v.vehicle_id), location: v.location }))
    return  new Fleet(fleetData.id,vehicles)
  }
}