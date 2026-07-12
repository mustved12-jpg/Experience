import React, { useEffect, useState } from 'react';
import { StatCard } from '../components/StatCard';
import { Card } from '../components/Card';
import { Table } from '../components/Table';
import { StatusBadge } from '../components/StatusBadge';
import { vehicleService } from '../services/vehicleService';
import { tripService } from '../services/tripService';
import { driverService } from '../services/driverService';
import { Truck, Map, Users, Wrench, Clock, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [allTrips, setAllTrips] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');

  useEffect(() => {
    const loadData = async () => {
      const vehicles = await vehicleService.getAll();
      const trips = await tripService.getAll();
      const drivers = await driverService.getAll();
      
      const activeVehicles = vehicles.filter(v => v.status === 'On Trip').length;
      const availableVehicles = vehicles.filter(v => v.status === 'Available').length;
      const inShopVehicles = vehicles.filter(v => v.status === 'In Shop').length;
      const activeTrips = trips.filter(t => t.status === 'Dispatched').length;
      const pendingTrips = trips.filter(t => t.status === 'Draft').length;
      const driversOnDuty = drivers.filter(d => d.status === 'On Trip').length;
      const totalVehicles = vehicles.length;
      
      const fleetUtilization = totalVehicles > 0 ? Math.round((activeVehicles / totalVehicles) * 100) : 0;
      
      setStats({
        activeVehicles,
        availableVehicles,
        inShopVehicles,
        activeTrips,
        pendingTrips,
        driversOnDuty,
        fleetUtilization
      });
      
      setAllTrips(trips);
      setAllVehicles(vehicles);
    };
    loadData();
  }, []);

  if (!stats) return <div className="p-8">Loading dashboard...</div>;

  const vehicleData = [
    { name: 'Available', value: stats.availableVehicles },
    { name: 'On Trip', value: stats.activeVehicles },
    { name: 'In Shop', value: stats.inShopVehicles },
  ];
  const COLORS = ['#10b981', '#3b82f6', '#ef4444'];

  const columns = [
    { header: 'Trip ID', accessor: 'id' },
    { header: 'Route', render: (row) => `${row.source} → ${row.destination}` },
    { header: 'Distance', render: (row) => `${row.plannedDistance || 0} km` },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> }
  ];

  // Filtering Trips
  const filteredTrips = allTrips.filter(trip => {
    const v = allVehicles.find(veh => veh.id === trip.vehicleId);
    const vType = v ? v.vehicleType : '';
    
    if (statusFilter !== 'All' && trip.status !== statusFilter) return false;
    if (typeFilter !== 'All' && vType !== typeFilter) return false;
    if (regionFilter !== 'All' && trip.destination !== regionFilter && trip.source !== regionFilter) return false;
    
    return true;
  }).reverse().slice(0, 10); // Show top 10

  const uniqueRegions = [...new Set([...allTrips.map(t => t.source), ...allTrips.map(t => t.destination)])];
  const uniqueTypes = [...new Set(allVehicles.map(v => v.vehicleType))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Platform Dashboard</h2>
        <div className="flex flex-wrap gap-2">
          <select className="border border-slate-300 rounded p-2 text-sm bg-white" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select className="border border-slate-300 rounded p-2 text-sm bg-white" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="All">All Vehicle Types</option>
            {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="border border-slate-300 rounded p-2 text-sm bg-white" value={regionFilter} onChange={e => setRegionFilter(e.target.value)}>
            <option value="All">All Regions</option>
            {uniqueRegions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Active Vehicles" value={stats.activeVehicles} icon={Truck} />
        <StatCard title="Available" value={stats.availableVehicles} icon={Truck} />
        <StatCard title="In Shop" value={stats.inShopVehicles} icon={Wrench} />
        <StatCard title="Active Trips" value={stats.activeTrips} icon={Map} />
        <StatCard title="Pending Trips" value={stats.pendingTrips} icon={Clock} />
        <StatCard title="Fleet Util. (%)" value={`${stats.fleetUtilization}%`} icon={Activity} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Fleet Status Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vehicleData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Vehicle Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vehicleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {vehicleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-slate-800 mb-4">Recent Trips</h3>
        <Table columns={columns} data={filteredTrips} />
      </Card>
    </div>
  );
};
