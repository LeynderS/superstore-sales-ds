import React from "react";
import { type TopCustomer } from "../../interfaces/dashboard";

interface TopCustomersTableProps {
  customers: TopCustomer[];
}

const TopCustomersTable: React.FC<TopCustomersTableProps> = ({ customers }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
      <h3 className="text-lg font-semibold mb-2">Top 10 Clientes por Venta</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cliente
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Segmento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ciudad
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Ventas
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {customers.map((cust, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">{cust.customer}</td>
              <td className="px-6 py-4 whitespace-nowrap">{cust.segment}</td>
              <td className="px-6 py-4 whitespace-nowrap">{cust.city}</td>
              <td className="px-6 py-4 whitespace-nowrap">{cust.state}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                $
                {cust.total_sales.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopCustomersTable;
