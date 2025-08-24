import React, { useState } from "react";
import { type TopProduct } from "../../interfaces/dashboard";

interface TopProductsTableProps {
  products: TopProduct[];
}

const ITEMS_PER_PAGE = 10; // 👈 mostramos 10 por página

const TopProductsTable: React.FC<TopProductsTableProps> = ({ products }) => {
  const [page, setPage] = useState(1);

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginated = products.slice(start, end);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
      <h3 className="text-lg font-semibold mb-2">Top Productos Más Vendidos</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Producto ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Categoría
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Subcategoría
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Nombre Producto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Total Ventas
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginated.map((prod, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">{prod.product_id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{prod.category}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {prod.sub_category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {prod.product_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                $
                {prod.total_sales.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Controles de paginación */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default TopProductsTable;
