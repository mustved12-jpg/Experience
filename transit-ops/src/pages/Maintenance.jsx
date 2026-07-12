import React, { useState, useEffect } from 'react';
import { maintenanceService } from '../services/maintenanceService';
import { vehicleService } from '../services/vehicleService';
import { Table } from '../components/Table';
import { Button } from '../components/Button';
import { SearchBar } from '../components/SearchBar';
import { StatusBadge } from '../components/StatusBadge';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Plus } from 'lucide-react';

export const Maintenance = () => {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '', issue: '', cost: 0, date: '', status: 'Active'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [mData, vData] = await Promise.all([
      maintenanceService.getAll(),
      vehicleService.getAll()
    ]);
    setLogs(mData.reverse());
    setVehicles(vData);
    setLoading(false);
  };

  const filteredLogs = logs.filter(log => 
    log.issue.toLowerCase().includes(search.toLowerCase()) ||
    log.vehicleId.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusChange = async (logId, newStatus, vehicleId) => {
    await maintenanceService.update(logId, { status: newStatus });
    if (newStatus === 'Active') {
      await vehicleService.update(vehicleId, { status: 'In Shop' });
    } else if (newStatus === 'Closed') {
      await vehicleService.update(vehicleId, { status: 'Available' });
    }
    loadData();
  };

  const columns = [
    { header: 'Vehicle ID', accessor: 'vehicleId' },
    { header: 'Issue', accessor: 'issue' },
    { header: 'Cost', render: (row) => `$${row.cost.toLocaleString()}` },
    { header: 'Date', accessor: 'date' },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { 
      header: 'Actions', 
      render: (row) => row.status === 'Active' ? (
        <Button variant="outline" onClick={() => handleStatusChange(row.id, 'Closed', row.vehicleId)} className="px-2 py-1 text-xs">Close Issue</Button>
      ) : null
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await maintenanceService.create(formData);
    if (formData.status === 'Active') {
      await vehicleService.update(formData.vehicleId, { status: 'In Shop' });
    }
    setIsModalOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Maintenance Logs</h2>
        <Button className="shrink-0" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Log Maintenance
        </Button>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by issue or vehicle ID..." />
        </div>
        {loading ? (
          <div className="text-center py-4 text-slate-500">Loading...</div>
        ) : (
          <Table columns={columns} data={filteredLogs} />
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Maintenance Issue">
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
          <div>
            <label className="block text-sm font-medium text-slate-700">Issue Description</label>
            <input required type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2" value={formData.issue} onChange={e => setFormData({...formData, issue: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Cost ($)</label>
              <input required type="number" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2" value={formData.cost} onChange={e => setFormData({...formData, cost: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Date</label>
              <input required type="date" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Log Issue</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
