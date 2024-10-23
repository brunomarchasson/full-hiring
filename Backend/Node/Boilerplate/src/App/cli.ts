#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { RegisterVehicleHandler } from './commands/RegisterVehicleHandler';
import { ParkVehicleHandler } from './commands/ParkVehicleHandler';
import { CreateFleetHandler } from './commands/CreateFleetHandler';
import { initDB } from '../Infra/database';
import { SQLiteFleetRepository } from '../Infra/repositories/sqlLiteFleetRepository';

const fleetRepository = new SQLiteFleetRepository()
const createFleetHandler = new CreateFleetHandler(fleetRepository,fleetRepository)
const registerVehicleHandler = new RegisterVehicleHandler(fleetRepository,fleetRepository)
const parkVehicleHandler = new ParkVehicleHandler(fleetRepository,fleetRepository)
  
function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return String(error)
}

initDB().then(() => {
  yargs(hideBin(process.argv))
    .command(
      'create <fleetId>',
      'create a fleet',
      (yargs)=> {
        return yargs
          .positional('fleetId', {
            describe: 'id of the fleet to create',
            type: 'string',
          })
      },
      (argv) => {
        if(argv.fleetId === undefined) {
          console.error('You need to provide a fleet id')
          return;
        }
        try{
          createFleetHandler.handle({ fleetId: argv.fleetId })
          console.log(`fleet ${argv.fleetId} created` )
        } catch (error) {
          console.error(getErrorMessage(error))
        }
      },

    )
    .command(
      'register-vehicle <fleetId> <vehiclePlateNumber>',
      'register a vehicle in the fleet',
      (yargs)=> {
        return yargs
          .positional('fleetId', {
            describe: 'id of the fleet',
            type: 'string',
          })
          .positional('vehiclePlateNumber', {
            describe: 'id of the vehicle to register',
            type: 'string',
          })
      },
      (argv) => {
        try{
          if(argv.fleetId === undefined || argv.vehiclePlateNumber === undefined) {
            console.error('You need to provide a fleet id and a vehicle id')
            return;
          }
          registerVehicleHandler.handle({ fleetId:  argv.fleetId, vehicleId: argv.vehiclePlateNumber })
          console.log("vehicle registred")
        } catch (error) {
          console.error(getErrorMessage(error))
        }
      },

    )
    .command(
      'localize-vehicle <fleetId> <vehicleId> <lat> <lng> [alt]',
      'register a vehicle in the fleet',
      (yargs)=> {
        return yargs
          .positional('fleetId', {
            describe: 'id of the fleet',
            type: 'string',
          })
          .positional('vehicleId', {
            describe: 'id of the vehicle',
            type: 'string',
          })
      },
      (argv) => {
        try{
          if(argv.fleetId === undefined || argv.vehicleId === undefined) {
            console.error('You need to provide a fleet id and a vehicle id')
            return;
          }
          let location = argv.lat+' '+argv.lng
          if (argv.alt) location += " "+argv.alt
          parkVehicleHandler.handle({ fleetId:  argv.fleetId, vehicleId: argv.vehicleId, location })
          console.log("vehicle localized")
        } catch (error) {
          console.error(getErrorMessage(error))
        }
      },

    )
    .strict()
    .demandCommand()
    .alias('h', 'help')
    .help('h')
    .parse();
})