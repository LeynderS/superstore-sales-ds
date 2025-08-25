import React, { useState } from "react";
import { type TopProduct } from "../../interfaces/dashboard";

interface TopProductsTableProps {
  products: TopProduct[];
}

const ITEMS_PER_PAGE = 10;

const TopProductsTable: React.FC<TopProductsTableProps> = ({ products }) => {
  const [page, setPage] = useState(1);

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginated = products.slice(start, end);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-red-100">
      <h3 className="text-lg font-semibold text-red-700 mb-4">
        Top Productos Más Vendidos
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-red-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Producto ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Subcategoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Nombre Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                Total Ventas
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginated.map((prod, index) => (
              <tr key={index} className="hover:bg-red-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                  {prod.product_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                  {prod.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                  {prod.sub_category}
                </td>
                <td className="px-6 py-4 break-words text-gray-800">
                  {prod.product_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-red-700 font-medium">
                  $
                  {prod.total_sales.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-red-50 text-red-600 rounded-md disabled:opacity-50 hover:bg-red-100 transition-colors"
        >
          Anterior
        </button>
        <span className="text-gray-600">
          Página {page} de {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-red-50 text-red-600 rounded-md disabled:opacity-50 hover:bg-red-100 transition-colors"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default TopProductsTable;
