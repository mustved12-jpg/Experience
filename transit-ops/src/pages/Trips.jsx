import React, { useState, useEffect } from 'react';
import { tripService } from '../services/tripService';
import { vehicleService } from '../services/vehicleService';
import { driverService } from '../services/driverService';
import { Table } from '../components/Table';
import { Button } from '../components/Button';
import { SearchBar } from '../components/SearchBar';
import { StatusBadge } from '../components/StatusBadge';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Plus } from 'lucide-react';

export const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    source: '', destination: '', vehicleId: '', driverId: '', cargoWeight: 0, plannedDistance: 0, status: 'Draft'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [tData, vData, dData] = await Promise.all([
      tripService.getAll(),
      vehicleService.getAll(),
      driverService.getAll()
    ]);
    setTrips(tData.reverse());
    setVehicles(vData);
    setDrivers(dData);
    setLoading(false);
  };

  const filteredTrips = trips.filter(t => 
    t.source.toLowerCase().includes(search.toLowerCase()) ||
    t.destination.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusChange = async (tripId, newStatus, vehicleId, driverId) => {
    await tripService.update(tripId, { status: newStatus });
    
    if (newStatus === 'Dispatched') {
      await vehicleService.update(vehicleId, { status: 'On Trip' });
      await driverService.update(driverId, { status: 'On Trip' });
    } else if (newStatus === 'Completed' || newStatus === 'Cancelled') {
      await vehicleService.update(vehicleId, { status: 'Available' });
      await driverService.update(driverId, { status: 'Available' });
    }
    
    loadData();
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Route', render: (row) => `${row.source} → ${row.destination}` },
    { header: 'Distance', render: (row) => `${row.plannedDistance || 0} km` },
    { header: 'Vehicle ID', accessor: 'vehicleId' },
    { header: 'Driver ID', accessor: 'driverId' },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { 
      header: 'Actions', 
      render: (row) => (
        <div className="flex gap-2">
          {row.status === 'Draft' && (
            <Button variant="primary" onClick={() => handleStatusChange(row.id, 'Dispatched', row.vehicleId, row.driverId)} className="px-2 py-1 text-xs">Dispatch</Button>
          )}
          {row.status === 'Dispatched' && (
            <Button variant="primary" onClick={() => handleStatusChange(row.id, 'Completed', row.vehicleId, row.driverId)} className="px-2 py-1 text-xs">Complete</Button>
          )}
          {(row.status === 'Draft' || row.status === 'Dispatched') && (
            <Button variant="danger" onClick={() => handleStatusChange(row.id, 'Cancelled', row.vehicleId, row.driverId)} className="px-2 py-1 text-xs">Cancel</Button>
          )}
        </div>
      )
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const vehicle = vehicles.find(v => v.id === formData.vehicleId);
    const driver = drivers.find(d => d.id === formData.driverId);
    
    if (!vehicle || vehicle.status !== 'Available') {
      return setError('Selected vehicle is not available.');
    }
    if (!driver || driver.status !== 'Available') {
      return setError('Selected driver is not available.');
    }
    if (formData.cargoWeight > vehicle.maxLoadCapacity) {
      return setError(`Cargo weight exceeds vehicle capacity (${vehicle.maxLoadCapacity}kg).`);
    }

    await tripService.create(formData);
    setIsModalOpen(false);
    loadData();
  };

  const availableVehicles = vehicles.filter(v => v.status === 'Available');
  const availableDrivers = drivers.filter(d => {
    const isAvailable = d.status === 'Available';
    // Set both to midnight to compare just the dates accurately
    const expiryDate = new Date(d.licenseExpiryDate);
    expiryDate.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    return isAvailable && expiryDate >= today;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Trip Management</h2>
        <Button className="shrink-0" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Create Trip
        </Button>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <SearchBar value={search} onChange={setSearch} placeholder="Search trips by route..." />
        </div>
        {loading ? (
          <div className="text-center py-4 text-slate-500">Loading...</div>
        ) : (
          <Table columns={columns} data={filteredTrips} />
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Trip">
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && <div className="p-3 bg-red-50 text-red-700 rounded text-sm">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Source</label>
              <input required type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Destination</label>
              <input required type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Vehicle (Available only)</label>
              <select required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2 bg-white" value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})}>
                <option value="">Select Vehicle</option>
                {availableVehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.vehicleName} ({v.maxLoadCapacity}kg)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Driver (Available only)</label>
              <select required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2 bg-white" value={formData.driverId} onChange={e => setFormData({...formData, driverId: e.target.value})}>
                <option value="">Select Driver</option>
                {availableDrivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Cargo Weight (kg)</label>
              <input required type="number" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2" value={formData.cargoWeight} onChange={e => setFormData({...formData, cargoWeight: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Planned Distance (km)</label>
              <input required type="number" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2" value={formData.plannedDistance} onChange={e => setFormData({...formData, plannedDistance: Number(e.target.value)})} />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Trip</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
