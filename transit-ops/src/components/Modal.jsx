import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-slate-900/50 transition-opacity" 
        onClick={onClose}
      />
      
      <div className="bg-white rounded-lg shadow-xl transform transition-all sm:max-w-lg w-full z-10 flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-medium text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-md"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="px-6 py-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
