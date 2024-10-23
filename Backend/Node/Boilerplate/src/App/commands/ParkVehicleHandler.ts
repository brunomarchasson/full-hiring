import { Vehicle } from "../../Domain/Vehicle";
import { IFleetReadRepository, IFleetWriteRepository } from "../../Infra/repositories/FleetRepository";

export interface ParkVehicleCommand {
    fleetId: string;
    vehicleId: string;
    location: string;
}

export class ParkVehicleHandler {
  constructor(private fleetReadRepository: IFleetReadRepository,private fleetWriteRepository: IFleetWriteRepository ) {}

  handle(command: ParkVehicleCommand): void {
    const fleet = this.fleetReadRepository.getFleetById(command.fleetId)
    if(!fleet) throw 'fleet not found'
    const vehicle = new Vehicle(command.vehicleId)
    fleet.parkVehicle(vehicle, command.location);
    this.fleetWriteRepository.save(fleet)
  }
}
