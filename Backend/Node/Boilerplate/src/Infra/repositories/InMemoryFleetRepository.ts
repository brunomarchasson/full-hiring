import { Fleet } from "../../Domain/Fleet";
import { IFleetReadRepository, IFleetWriteRepository } from "./FleetRepository";

export class InMemoryFleetRepository implements IFleetWriteRepository, IFleetReadRepository {
  private fleets: Map<string, Fleet> = new Map();
      
  getFleetById(fleetId: string): Fleet | undefined {
    return this.fleets.get(fleetId);
  }
  
  fleetExists(fleetId: string): boolean {
    return this.fleets.has(fleetId);
  }
      
  save(fleet: Fleet): void {
    this.fleets.set(fleet.id, fleet);
  }
}
