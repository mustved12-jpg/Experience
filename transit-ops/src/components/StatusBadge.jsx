import React from 'react';

export const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status?.toLowerCase()) {
      case 'available':
      case 'completed':
      case 'closed':
        return 'bg-green-100 text-green-800';
      case 'on trip':
      case 'dispatched':
      case 'active':
        return 'bg-brand-100 text-brand-800';
      case 'in shop':
      case 'suspended':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'off duty':
      case 'draft':
      case 'retired':
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStyles()}`}>
      {status}
    </span>
  );
};
