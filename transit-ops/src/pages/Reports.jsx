import React, { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { expenseService } from '../services/expenseService';
import { fuelService } from '../services/fuelService';
import { maintenanceService } from '../services/maintenanceService';
import { vehicleService } from '../services/vehicleService';
import { tripService } from '../services/tripService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts';
import { DollarSign, Droplets, Wrench, Receipt, Download, TrendingUp, Activity, Compass } from 'lucide-react';
import { Button } from '../components/Button';

export const Reports = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const expenses = await expenseService.getAll();
      const fuel = await fuelService.getAll();
      const maintenance = await maintenanceService.getAll();
      const vehicles = await vehicleService.getAll();
      const trips = await tripService.getAll();

      const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
      const totalFuelCost = fuel.reduce((sum, f) => sum + f.fuelCost, 0);
      const totalFuelLiters = fuel.reduce((sum, f) => sum + f.fuelLiters, 0);
      const totalMaintenanceCost = maintenance.reduce((sum, m) => sum + m.cost, 0);
      const totalOperationalCost = totalExpenses + totalFuelCost + totalMaintenanceCost;
      
      const totalDistance = trips.reduce((sum, t) => sum + t.plannedDistance, 0);
      const fuelEfficiency = totalFuelLiters > 0 ? (totalDistance / totalFuelLiters).toFixed(2) : 0;
      
      const activeVehicles = vehicles.filter(v => v.status === 'On Trip').length;
      const fleetUtilization = vehicles.length > 0 ? Math.round((activeVehicles / vehicles.length) * 100) : 0;
      
      const totalAcquisitionCost = vehicles.reduce((sum, v) => sum + v.acquisitionCost, 0);
      const simulatedRevenue = totalDistance * 5; // $5 per km
      const roi = totalAcquisitionCost > 0 ? (((simulatedRevenue - totalOperationalCost) / totalAcquisitionCost) * 100).toFixed(2) : 0;

      setData({
        totalOperationalCost,
        totalFuelCost,
        totalMaintenanceCost,
        totalExpenses,
        fuelEfficiency,
        fleetUtilization,
        roi,
        simulatedRevenue
      });
    };
    loadData();
  }, []);

  const exportCSV = () => {
    if (!data) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Total Operational Cost,$${data.totalOperationalCost}\n`
      + `Fuel Cost,$${data.totalFuelCost}\n`
      + `Maintenance Cost,$${data.totalMaintenanceCost}\n`
      + `General Expenses,$${data.totalExpenses}\n`
      + `Simulated Revenue,$${data.simulatedRevenue}\n`
      + `Fuel Efficiency (km/L),${data.fuelEfficiency}\n`
      + `Fleet Utilization,${data.fleetUtilization}%\n`
      + `Overall Fleet ROI,${data.roi}%\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transitops_financial_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!data) return <div className="p-8">Loading reports...</div>;

  const costDistribution = [
    { name: 'Fuel', value: data.totalFuelCost },
    { name: 'Maintenance', value: data.totalMaintenanceCost },
    { name: 'General Expenses', value: data.totalExpenses },
  ];
  const COLORS = ['#f59e0b', '#ef4444', '#3b82f6'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Financial Reports & Analytics</h2>
        <Button onClick={exportCSV} className="flex items-center gap-2">
          <Download size={16} /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Ops Cost" value={`$${data.totalOperationalCost.toLocaleString()}`} icon={DollarSign} />
        <StatCard title="Fuel Efficiency" value={`${data.fuelEfficiency} km/L`} icon={Compass} />
        <StatCard title="Fleet Util." value={`${data.fleetUtilization}%`} icon={Activity} />
        <StatCard title="Overall ROI" value={`${data.roi}%`} icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Cost Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {costDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => `$${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Cost Breakdown</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip formatter={(value) => `$${value}`} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {costDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
