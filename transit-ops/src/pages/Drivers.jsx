import React, { useState, useEffect } from 'react';
import { driverService } from '../services/driverService';
import { Table } from '../components/Table';
import { Button } from '../components/Button';
import { SearchBar } from '../components/SearchBar';
import { StatusBadge } from '../components/StatusBadge';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialForm = {
    fullName: '', licenseNumber: '', licenseCategory: 'Standard', licenseExpiryDate: '', contactNumber: '', status: 'Available'
  };
  const [formData, setFormData] = useState(initialForm);

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
    d.fullName.toLowerCase().includes(search.toLowerCase()) ||
    d.licenseNumber.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (driver) => {
    setEditingId(driver.id);
    setFormData({
      fullName: driver.fullName,
      licenseNumber: driver.licenseNumber,
      licenseCategory: driver.licenseCategory,
      licenseExpiryDate: driver.licenseExpiryDate,
      contactNumber: driver.contactNumber,
      status: driver.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      await driverService.delete(id);
      loadDrivers();
    }
  };

  const columns = [
    { header: 'Name', accessor: 'fullName' },
    { header: 'License No.', accessor: 'licenseNumber' },
    { header: 'Category', accessor: 'licenseCategory' },
    { header: 'Safety Score', render: (row) => `${row.safetyScore}/100` },
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
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await driverService.update(editingId, formData);
    } else {
      await driverService.create({ ...formData, safetyScore: 100 });
    }
    setIsModalOpen(false);
    loadDrivers();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Driver Management</h2>
        <Button className="shrink-0" onClick={openAddModal}>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Driver" : "Add New Driver"}>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Full Name</label>
            <input required type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
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
          {editingId && (
            <div>
              <label className="block text-sm font-medium text-slate-700">Status</label>
              <select className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2 bg-white" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Available">Available</option>
                <option value="On Trip">On Trip</option>
                <option value="Off Duty">Off Duty</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          )}
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Driver</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
