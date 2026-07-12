import React, { useState, useEffect } from 'react';
import { vehicleService } from '../services/vehicleService';
import { Table } from '../components/Table';
import { Button } from '../components/Button';
import { SearchBar } from '../components/SearchBar';
import { StatusBadge } from '../components/StatusBadge';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  
  const initialForm = {
    registrationNumber: '', vehicleName: '', vehicleType: 'Truck', maxLoadCapacity: 1000, acquisitionCost: 0, status: 'Available'
  };
  const [formData, setFormData] = useState(initialForm);

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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      await vehicleService.delete(id);
      loadVehicles();
    }
  };

  const columns = [
    { header: 'Reg No.', accessor: 'registrationNumber' },
    { header: 'Name', accessor: 'vehicleName' },
    { header: 'Type', accessor: 'vehicleType' },
    { header: 'Capacity', render: (row) => `${row.maxLoadCapacity} kg` },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => openEditModal(row)} className="px-2 py-1 text-xs flex items-center gap-1">
            <Edit2 size={14} /> Edit
          </Button>
          <Button variant="danger" onClick={() => handleDelete(row.id)} className="px-2 py-1 text-xs flex items-center gap-1">
            <Trash2 size={14} /> Delete
          </Button>
        </div>
      )
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check for unique registration number
    const isDuplicate = vehicles.some(v => v.id !== editingId && v.registrationNumber.toLowerCase() === formData.registrationNumber.toLowerCase());
    if (isDuplicate) {
      return setError('A vehicle with this Registration Number already exists.');
    }

    if (editingId) {
      await vehicleService.update(editingId, formData);
    } else {
      await vehicleService.create({ ...formData, odometer: 0 });
    }
    
    setIsModalOpen(false);
    loadVehicles();
  };

  const openAddModal = () => {
    setError('');
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setError('');
    setEditingId(vehicle.id);
    setFormData({
      registrationNumber: vehicle.registrationNumber,
      vehicleName: vehicle.vehicleName,
      vehicleType: vehicle.vehicleType,
      maxLoadCapacity: vehicle.maxLoadCapacity,
      acquisitionCost: vehicle.acquisitionCost,
      status: vehicle.status
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Vehicle Registry</h2>
        <Button className="shrink-0" onClick={openAddModal}>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Vehicle" : "Add New Vehicle"}>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && <div className="p-3 bg-red-50 text-red-700 rounded text-sm">{error}</div>}
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
          {editingId && (
            <div>
              <label className="block text-sm font-medium text-slate-700">Status</label>
              <select className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2 bg-white" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Available">Available</option>
                <option value="On Trip">On Trip</option>
                <option value="In Shop">In Shop</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
          )}
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Vehicle</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
