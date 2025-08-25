import React, { useState } from "react";
import Filters from "../components/Filters";
import TotalSales from "../components/indicators/TotalSales";
import SalesBySegmentUI from "../components/indicators/SalesBySegment";
import TopCustomersTable from "../components/tables/TopCustomerTable";
import TopProductsTable from "../components/tables/TopProductsTable";
import SalesOverTimeChart from "../components/charts/SalesOverTimeChart";
import SalesByCategoryChart from "../components/charts/SalesByCategoryChart";
import { useFilters } from "../hooks/useFilters";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Dashboard: React.FC = () => {
  const { dashboardData, dashboardError } = useFilters();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 font-sans">
      {/* Botón hamburguesa para móviles */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-red-500 text-white p-2 rounded-lg shadow-md"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Sidebar fijo en desktop */}
      <aside className="hidden lg:block w-72 bg-white shadow-lg p-6 fixed h-full overflow-y-auto border-r border-gray-200">
        <h2 className="text-2xl font-bold text-red-500 mb-6">Filtros</h2>
        <Filters />
      </aside>

      {/* Sidebar tipo Drawer para móviles */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Fondo semitransparente */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* Panel lateral */}
          <div className="relative w-72 bg-white shadow-lg p-6 h-full overflow-y-auto z-50">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold text-red-500 mb-6">Filtros</h2>
            <Filters />
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <main className="flex-1 lg:ml-72 p-6 lg:p-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-10">
          Control de Mando <span className="text-red-500">Superstore</span>
        </h1>

        {dashboardData?.indicators.total_sales === 0 && (
          <div className="text-gray-500 font-bold">
            No hay resultados para mostrar, prueba a ajustar los filtros.
          </div>
        )}

        {dashboardData && (
          <div className="space-y-10">
            {/* Indicadores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TotalSales total={dashboardData.indicators.total_sales} />
              <SalesBySegmentUI
                segments={dashboardData.indicators.sales_by_segment}
              />
            </div>

            {/* Tablas */}
            <div className="grid grid-cols-1 gap-6">
              <TopCustomersTable
                customers={dashboardData.tables.top_customers}
              />
              <TopProductsTable products={dashboardData.tables.top_products} />
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SalesOverTimeChart data={dashboardData.charts.sales_over_time} />
              <SalesByCategoryChart
                data={dashboardData.charts.sales_by_category}
              />
            </div>
          </div>
        )}

        {dashboardError && (
          <div className="text-red-700 font-semibold mt-6 bg-red-100 p-4 rounded-lg shadow">
            {dashboardError}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
