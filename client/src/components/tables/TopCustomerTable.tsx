import React from "react";
import { type TopCustomer } from "../../interfaces/dashboard";

interface TopCustomersTableProps {
  customers: TopCustomer[];
}

const TopCustomersTable: React.FC<TopCustomersTableProps> = ({ customers }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-red-100">
      <h3 className="text-lg font-semibold text-red-700 mb-4">
        Top 10 Clientes por Venta
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-red-100">
          <thead className="bg-red-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Segmento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Ciudad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                Total Ventas
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-red-100">
            {customers.map((cust, index) => (
              <tr key={index} className="hover:bg-red-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                  {cust.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                  {cust.segment}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                  {cust.city}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                  {cust.state}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-red-700 font-medium">
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
    </div>
  );
};

export default TopCustomersTable;
