import React, { useState, useEffect } from 'react';
import { vehicleService } from '../services/vehicleService';
import { Table } from '../components/Table';
import { Button } from '../components/Button';
import { SearchBar } from '../components/SearchBar';
import { StatusBadge } from '../components/StatusBadge';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Plus } from 'lucide-react';

export const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    registrationNumber: '', vehicleName: '', vehicleType: 'Truck', maxLoadCapacity: 1000, acquisitionCost: 0, status: 'Available'
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    const data = await vehicleService.getAll();
    setVehicles(data);
    setLoading(false);
  };

  const filteredVehicles = vehicles.filter(v => 
    v.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
    v.vehicleName.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: 'Reg No.', accessor: 'registrationNumber' },
    { header: 'Name', accessor: 'vehicleName' },
    { header: 'Type', accessor: 'vehicleType' },
    { header: 'Capacity', render: (row) => `${row.maxLoadCapacity} kg` },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await vehicleService.create({ ...formData, odometer: 0 });
    setIsModalOpen(false);
    loadVehicles();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Vehicle Registry</h2>
        <Button className="shrink-0" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Add Vehicle
        </Button>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <SearchBar value={search} onChange={setSearch} placeholder="Search vehicles..." />
        </div>
        {loading ? (
          <div className="text-center py-4 text-slate-500">Loading...</div>
        ) : (
          <Table columns={columns} data={filteredVehicles} />
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Vehicle">
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Registration Number</label>
            <input required type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2" value={formData.registrationNumber} onChange={e => setFormData({...formData, registrationNumber: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Vehicle Name</label>
            <input required type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2" value={formData.vehicleName} onChange={e => setFormData({...formData, vehicleName: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Type</label>
              <select className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2 bg-white" value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value})}>
                <option>Truck</option>
                <option>Van</option>
                <option>Lorry</option>
                <option>Trailer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Capacity (kg)</label>
              <input required type="number" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2" value={formData.maxLoadCapacity} onChange={e => setFormData({...formData, maxLoadCapacity: Number(e.target.value)})} />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Vehicle</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
