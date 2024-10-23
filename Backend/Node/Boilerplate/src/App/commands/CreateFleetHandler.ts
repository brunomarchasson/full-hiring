import { Fleet } from "../../Domain/Fleet";
import { IFleetReadRepository, IFleetWriteRepository } from "../../Infra/repositories/FleetRepository";

export interface CreateFleetCommand {
    fleetId: string;
}

export class CreateFleetHandler {
  constructor(
    
    private fleetReadRepository: IFleetReadRepository,
    private fleetWriteRepository: IFleetWriteRepository) {}

  handle(command: CreateFleetCommand): void {
    const existingFleet =  this.fleetWriteRepository.fleetExists(command.fleetId)
    
    if(existingFleet)throw new Error('Fleet already exists');
    const fleet = new Fleet(command.fleetId)
    this.fleetWriteRepository.save(fleet) 
  }
}