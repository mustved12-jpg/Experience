import React, { useEffect, useState } from 'react';
import { StatCard } from '../components/StatCard';
import { Card } from '../components/Card';
import { Table } from '../components/Table';
import { StatusBadge } from '../components/StatusBadge';
import { vehicleService } from '../services/vehicleService';
import { tripService } from '../services/tripService';
import { driverService } from '../services/driverService';
import { Truck, Map, Users, Wrench } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTrips, setRecentTrips] = useState([]);
  
  useEffect(() => {
    const loadData = async () => {
      const vehicles = await vehicleService.getAll();
      const trips = await tripService.getAll();
      const drivers = await driverService.getAll();
      
      const activeVehicles = vehicles.filter(v => v.status === 'On Trip').length;
      const availableVehicles = vehicles.filter(v => v.status === 'Available').length;
      const inShopVehicles = vehicles.filter(v => v.status === 'In Shop').length;
      const activeTrips = trips.filter(t => t.status === 'Dispatched').length;
      const driversOnDuty = drivers.filter(d => d.status === 'On Trip').length;
      
      setStats({
        activeVehicles,
        availableVehicles,
        inShopVehicles,
        activeTrips,
        driversOnDuty
      });
      
      setRecentTrips(trips.slice(-5).reverse());
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
    { header: 'Source', accessor: 'source' },
    { header: 'Destination', accessor: 'destination' },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Available Vehicles" value={stats.availableVehicles} icon={Truck} />
        <StatCard title="Active Trips" value={stats.activeTrips} icon={Map} />
        <StatCard title="Drivers On Duty" value={stats.driversOnDuty} icon={Users} />
        <StatCard title="Vehicles In Shop" value={stats.inShopVehicles} icon={Wrench} />
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
        <Table columns={columns} data={recentTrips} />
      </Card>
    </div>
  );
};
