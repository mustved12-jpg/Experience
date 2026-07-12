import React from 'react';

export const Table = ({ columns, data, onRowClick }) => {
  return (
    <div className="overflow-x-auto shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full divide-y divide-slate-300">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-4 pl-4 pr-3 text-sm font-medium text-slate-500 text-center sm:pl-6">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr 
                key={row.id || i} 
                onClick={() => onRowClick && onRowClick(row)}
                className={onRowClick ? 'cursor-pointer hover:bg-slate-50 transition-colors' : ''}
              >
                {columns.map((col, j) => (
                  <td key={j} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-slate-500 sm:pl-6">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
