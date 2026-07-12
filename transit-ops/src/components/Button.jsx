import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "text-slate-900 bg-blue-400 hover:bg-blue-500 focus:ring-blue-500 border border-transparent font-bold",
    secondary: "text-blue-700 bg-blue-50 hover:bg-blue-100 focus:ring-blue-500 border border-transparent",
    outline: "text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 focus:ring-blue-500",
    danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 border border-transparent",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
