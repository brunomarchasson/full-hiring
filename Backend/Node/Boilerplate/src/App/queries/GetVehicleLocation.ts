import { IFleetReadRepository } from "../../Infra/repositories/FleetRepository";

export type IsVehicleInFleetQuery = {
    fleetId: string;
    vehicleId: string;
}

export class IsVehicleInFleetHandler {
  constructor(private fleetReadRepository: IFleetReadRepository ) {}
  
  handle(query: IsVehicleInFleetQuery): boolean {
    const fleet = this.fleetReadRepository.getFleetById(query.fleetId)
    if(!fleet) throw 'fleet not found';

    return fleet.isVehicleInFleet({ id: query.vehicleId })
  }
}
