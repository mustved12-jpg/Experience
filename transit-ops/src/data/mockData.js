// mockData.js

const generateVehicles = () => {
  const types = ['Truck', 'Van', 'Lorry', 'Trailer'];
  const statuses = ['Available', 'On Trip', 'In Shop', 'Retired'];
  return Array.from({ length: 20 }, (_, i) => ({
    id: `v-${i + 1}`,
    registrationNumber: `REG-${1000 + i}`,
    vehicleName: `Transport Unit ${i + 1}`,
    vehicleType: types[i % types.length],
    maxLoadCapacity: (i % 5 + 1) * 1000,
    odometer: 10000 + i * 5000,
    acquisitionCost: 50000 + i * 2000,
    status: i < 10 ? 'Available' : statuses[i % statuses.length],
  }));
};

const generateDrivers = () => {
  const statuses = ['Available', 'On Trip', 'Off Duty', 'Suspended'];
  return Array.from({ length: 20 }, (_, i) => ({
    id: `d-${i + 1}`,
    name: `Driver ${i + 1}`,
    licenseNumber: `LIC-${5000 + i}`,
    licenseCategory: i % 2 === 0 ? 'Heavy' : 'Standard',
    licenseExpiryDate: `202${6 + (i % 4)}-10-12`,
    contactNumber: `555-010${i.toString().padStart(2, '0')}`,
    safetyScore: 85 + (i % 15),
    status: i < 10 ? 'Available' : statuses[i % statuses.length],
  }));
};

const generateTrips = (vehicles, drivers) => {
  const statuses = ['Draft', 'Dispatched', 'Completed', 'Cancelled'];
  const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'];
  return Array.from({ length: 15 }, (_, i) => ({
    id: `t-${i + 1}`,
    source: locations[i % locations.length],
    destination: locations[(i + 3) % locations.length],
    vehicleId: vehicles[i % vehicles.length].id,
    driverId: drivers[i % drivers.length].id,
    cargoWeight: 500 + i * 100,
    plannedDistance: 100 + i * 50,
    status: statuses[i % statuses.length],
  }));
};

const generateMaintenance = (vehicles) => {
  const issues = ['Oil Change', 'Brake Replacement', 'Tire Rotation', 'Engine Check'];
  const statuses = ['Active', 'Closed'];
  return Array.from({ length: 10 }, (_, i) => ({
    id: `m-${i + 1}`,
    vehicleId: vehicles[i % vehicles.length].id,
    issue: issues[i % issues.length],
    cost: 150 + i * 50,
    date: `2023-10-${(i % 28 + 1).toString().padStart(2, '0')}`,
    status: statuses[i % statuses.length],
  }));
};

const generateFuel = (vehicles) => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `f-${i + 1}`,
    vehicleId: vehicles[i % vehicles.length].id,
    fuelLiters: 50 + i * 10,
    fuelCost: (50 + i * 10) * 1.5,
    date: `2023-10-${(i % 28 + 1).toString().padStart(2, '0')}`,
  }));
};

const generateExpenses = (vehicles) => {
  const types = ['Tolls', 'Parking', 'Food', 'Lodging', 'Repairs'];
  return Array.from({ length: 20 }, (_, i) => ({
    id: `e-${i + 1}`,
    vehicleId: vehicles[i % vehicles.length].id,
    expenseType: types[i % types.length],
    amount: 20 + i * 5,
    date: `2023-10-${(i % 28 + 1).toString().padStart(2, '0')}`,
  }));
};

const vehicles = generateVehicles();
const drivers = generateDrivers();
const trips = generateTrips(vehicles, drivers);
const maintenance = generateMaintenance(vehicles);
const fuel = generateFuel(vehicles);
const expenses = generateExpenses(vehicles);

export const mockData = {
  vehicles,
  drivers,
  trips,
  maintenance,
  fuel,
  expenses
};
