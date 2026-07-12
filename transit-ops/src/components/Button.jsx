import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "text-white bg-brand-600 hover:bg-brand-700 focus:ring-brand-500 border border-transparent",
    secondary: "text-brand-700 bg-brand-50 hover:bg-brand-100 focus:ring-brand-500 border border-transparent",
    outline: "text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 focus:ring-brand-500",
    danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 border border-transparent",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
