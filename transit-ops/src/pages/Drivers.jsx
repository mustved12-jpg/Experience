import React, { useState, useEffect } from 'react';
import { driverService } from '../services/driverService';
import { Table } from '../components/Table';
import { Button } from '../components/Button';
import { SearchBar } from '../components/SearchBar';
import { StatusBadge } from '../components/StatusBadge';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Plus } from 'lucide-react';

export const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', licenseNumber: '', licenseCategory: 'Standard', licenseExpiryDate: '', contactNumber: '', status: 'Available'
  });

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    setLoading(true);
    const data = await driverService.getAll();
    setDrivers(data);
    setLoading(false);
  };

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.licenseNumber.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'License No.', accessor: 'licenseNumber' },
    { header: 'Category', accessor: 'licenseCategory' },
    { header: 'Safety Score', render: (row) => `${row.safetyScore}/100` },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await driverService.create({ ...formData, safetyScore: 100 });
    setIsModalOpen(false);
    loadDrivers();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Driver Management</h2>
        <Button className="shrink-0" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Add Driver
        </Button>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <SearchBar value={search} onChange={setSearch} placeholder="Search drivers..." />
        </div>
        {loading ? (
          <div className="text-center py-4 text-slate-500">Loading...</div>
        ) : (
          <Table columns={columns} data={filteredDrivers} />
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Driver">
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Full Name</label>
            <input required type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">License Number</label>
              <input required type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2" value={formData.licenseNumber} onChange={e => setFormData({...formData, licenseNumber: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Category</label>
              <select className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2 bg-white" value={formData.licenseCategory} onChange={e => setFormData({...formData, licenseCategory: e.target.value})}>
                <option>Standard</option>
                <option>Heavy</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Expiry Date</label>
              <input required type="date" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2" value={formData.licenseExpiryDate} onChange={e => setFormData({...formData, licenseExpiryDate: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Contact Number</label>
              <input required type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2" value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Driver</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
