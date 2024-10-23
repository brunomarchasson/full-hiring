import { IFleetReadRepository } from "../../Infra/repositories/FleetRepository";

export type GetVehicleLocationQuery = {
    fleetId: string;
    vehicleId: string;
}

export class GetVehicleLocationHandler {
  constructor(private fleetReadRepository: IFleetReadRepository ) {}
  
  handle(query: GetVehicleLocationQuery): string | undefined {
    const fleet = this.fleetReadRepository.getFleetById(query.fleetId)
    if(!fleet) throw 'fleet not found';

    return fleet.getVehicleLocation({ id: query.vehicleId })
  }
}
