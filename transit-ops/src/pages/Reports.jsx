import React, { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { expenseService } from '../services/expenseService';
import { fuelService } from '../services/fuelService';
import { maintenanceService } from '../services/maintenanceService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts';
import { DollarSign, Droplets, Wrench, Receipt } from 'lucide-react';

export const Reports = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const expenses = await expenseService.getAll();
      const fuel = await fuelService.getAll();
      const maintenance = await maintenanceService.getAll();

      const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
      const totalFuelCost = fuel.reduce((sum, f) => sum + f.fuelCost, 0);
      const totalMaintenanceCost = maintenance.reduce((sum, m) => sum + m.cost, 0);
      const totalOperationalCost = totalExpenses + totalFuelCost + totalMaintenanceCost;

      setData({
        totalOperationalCost,
        totalFuelCost,
        totalMaintenanceCost,
        totalExpenses
      });
    };
    loadData();
  }, []);

  if (!data) return <div className="p-8">Loading reports...</div>;

  const costDistribution = [
    { name: 'Fuel', value: data.totalFuelCost },
    { name: 'Maintenance', value: data.totalMaintenanceCost },
    { name: 'General Expenses', value: data.totalExpenses },
  ];
  const COLORS = ['#f59e0b', '#ef4444', '#3b82f6'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Financial Reports</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Ops Cost" value={`$${data.totalOperationalCost.toLocaleString()}`} icon={DollarSign} />
        <StatCard title="Fuel Cost" value={`$${data.totalFuelCost.toLocaleString()}`} icon={Droplets} />
        <StatCard title="Maintenance Cost" value={`$${data.totalMaintenanceCost.toLocaleString()}`} icon={Wrench} />
        <StatCard title="General Expenses" value={`$${data.totalExpenses.toLocaleString()}`} icon={Receipt} />
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
