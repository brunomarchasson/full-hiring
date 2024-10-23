import { Fleet } from "../../Domain/Fleet";

export interface IFleetReadRepository {
    getFleetById(id: string): Fleet | undefined;
}

export interface IFleetWriteRepository {
    fleetExists(fleetId: string): boolean
    save(fleet: Fleet): void;
}
