import { Fleet } from '../../Domain/Fleet';
import { Vehicle } from '../../Domain/Vehicle';
import { IFleetReadRepository, IFleetWriteRepository } from '../../Infra/repositories/FleetRepository';

export type RegisterVehicleCommand = {
    fleetId: string;
    vehicleId: string;
}

export class RegisterVehicleHandler {
  constructor(private fleetReadRepository: IFleetReadRepository,private fleetWriteRepository: IFleetWriteRepository ) {}

  private getFleet(fleetId: string):Fleet{
    const fleet = this.fleetReadRepository.getFleetById(fleetId)
    if(!fleet) throw new Error('Fleet not found');
    return fleet
  }
  
  handle(command: RegisterVehicleCommand): void {
    const fleet = this.getFleet(command.fleetId);
    const vehicle = new Vehicle(command.vehicleId);
    fleet.registerVehicle(vehicle)
    this.fleetWriteRepository.save(fleet)
  }
}
