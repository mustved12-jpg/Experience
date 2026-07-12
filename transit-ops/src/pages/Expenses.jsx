import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import { vehicleService } from '../services/vehicleService';
import { Table } from '../components/Table';
import { Button } from '../components/Button';
import { SearchBar } from '../components/SearchBar';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Plus } from 'lucide-react';

export const Expenses = () => {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '', expenseType: 'Tolls', amount: 0, date: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [mData, vData] = await Promise.all([
      expenseService.getAll(),
      vehicleService.getAll()
    ]);
    setLogs(mData.reverse());
    setVehicles(vData);
    setLoading(false);
  };

  const filteredLogs = logs.filter(log => 
    log.expenseType.toLowerCase().includes(search.toLowerCase()) ||
    log.vehicleId.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Vehicle ID', accessor: 'vehicleId' },
    { header: 'Expense Type', accessor: 'expenseType' },
    { header: 'Amount', render: (row) => `$${row.amount.toLocaleString()}` },
    { header: 'Date', accessor: 'date' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await expenseService.create(formData);
    setIsModalOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Operational Expenses</h2>
        <Button className="shrink-0" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Log Expense
        </Button>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by type or vehicle ID..." />
        </div>
        {loading ? (
          <div className="text-center py-4 text-slate-500">Loading...</div>
        ) : (
          <Table columns={columns} data={filteredLogs} />
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Expense">
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Vehicle</label>
            <select required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2 bg-white" value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})}>
              <option value="">Select Vehicle</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.vehicleName} ({v.registrationNumber})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Expense Type</label>
              <select required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2 bg-white" value={formData.expenseType} onChange={e => setFormData({...formData, expenseType: e.target.value})}>
                <option>Tolls</option>
                <option>Parking</option>
                <option>Food</option>
                <option>Lodging</option>
                <option>Repairs</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Amount ($)</label>
              <input required type="number" step="0.01" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Date</label>
            <input required type="date" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Log Expense</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
