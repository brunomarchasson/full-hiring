import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { Fleet } from '../../../../Domain/Fleet';
import { Vehicle } from '../../../../Domain/Vehicle';
import { RegisterVehicleCommand, RegisterVehicleHandler } from '../../../commands/RegisterVehicleHandler';
import { ParkVehicleCommand, ParkVehicleHandler } from '../../../commands/ParkVehicleHandler';
import { InMemoryFleetRepository } from '../../../../Infra/repositories/InMemoryFleetRepository';
import { IsVehicleInFleetHandler } from '../../../queries/GetVehicleLocation';
import { GetVehicleLocationHandler } from '../../../queries/IsVehicleInFleetQuery';

const fleetRepository = new InMemoryFleetRepository()
const registerVehicleHandler = new RegisterVehicleHandler(fleetRepository,fleetRepository)
const parkVehicleHandler = new ParkVehicleHandler(fleetRepository,fleetRepository)
const getVehicleLocationHandler = new GetVehicleLocationHandler(fleetRepository)
const isVehicleInFleetHandler = new IsVehicleInFleetHandler(fleetRepository)

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return String(error)
}

Given('my fleet', function () {
  this.fleet = new Fleet('myFleet')
  fleetRepository.save(this.fleet)
});

Given('a vehicle', function () {
  this.vehicle = new Vehicle('ABC123');
});

Given('I have registered this vehicle into my fleet', function () {
  this.fleet.registerVehicle(this.vehicle)
  fleetRepository.save(this.fleet)
});

When('I try to register this vehicle into my fleet', function () {
  const command : RegisterVehicleCommand = { vehicleId: this.vehicle.id, fleetId: 'myFleet' };
  try {
    registerVehicleHandler.handle(command);
    this.registrationResult = 'success';
  } catch (e) {
    this.registrationResult = getErrorMessage(e);
  }
});

Then('this vehicle should be part of my vehicle fleet', async function () {
  const vehicleExists = isVehicleInFleetHandler.handle({ fleetId: this.fleet.id, vehicleId: this.vehicle.id })
  assert.strictEqual(vehicleExists, true);
});

Then('I should be informed this vehicle has already been registered into my fleet', function () {
  assert.strictEqual(this.registrationResult, 'This vehicle has already been registered in your fleet.');
});

Given('the fleet of another user', function () {
  const otherFleet = new Fleet('otherFleet');
  this.otherFleet = otherFleet;
  fleetRepository.save(this.otherFleet)
});

Given("this vehicle has been registered in the other user's fleet", function () {
  const command : RegisterVehicleCommand = { vehicleId: this.vehicle.id, fleetId: this.otherFleet.id };

  registerVehicleHandler.handle(command);
});

When('I register this vehicle into my fleet', function () {
  const command : RegisterVehicleCommand = { vehicleId: this.vehicle.id, fleetId: this.fleet.id };
  registerVehicleHandler.handle(command);
  this.registrationResult = 'success';
});

Given('a location', function () {
  this.location = 'LocationA';
});

When('I park my vehicle at this location', function () {
  const command: ParkVehicleCommand = { vehicleId: this.vehicle.id, fleetId: this.fleet.id, location: this.location }
  try {
    parkVehicleHandler.handle(command);
    this.parkResult = 'success';
  } catch (e) {
    this.parkResult =getErrorMessage(e);
  }
});

Then('I should be informed that my vehicle is already parked at this location', function () {
  assert.strictEqual(this.parkResult, 'This vehicle is already parked at this location.');
})

When('I try to park my vehicle at this location', function(){
  const command: ParkVehicleCommand = { vehicleId: this.vehicle.id, fleetId: this.fleet.id, location: this.location }
  try {
    parkVehicleHandler.handle(command);
    this.parkResult = 'success';
  } catch (e) {
    this.parkResult = getErrorMessage(e);
  }
})

Then('the known location of my vehicle should verify this location', function () {
  const location = getVehicleLocationHandler.handle({ fleetId: 'myFleet', vehicleId: this.vehicle.id })
  assert.strictEqual(location, this.location);
});

Given('my vehicle has been parked into this location', function () {
  const command = { vehicleId: this.vehicle.id, fleetId: this.fleet.id, location: this.location } as ParkVehicleCommand;
  parkVehicleHandler.handle(command);
})
