import React from "react";
import Filters from "../components/Filters";
import TotalSales from "../components/indicators/TotalSales";
import SalesBySegmentUI from "../components/indicators/SalesBySegment";
import TopCustomersTable from "../components/tables/TopCustomerTable";
import TopProductsTable from "../components/tables/TopProductsTable";
import { useFilters } from "../hooks/useFilters";

const Dashboard: React.FC = () => {
  const { dashboardData, dashboardError } = useFilters();

  return (
    <div>
      <div className="container mx-auto max-w-10xl p-10">
        <h1 className="text-3xl font-bold mb-6">Control de Mando Superstore</h1>
        <Filters />

        {dashboardData && (
          <div>
            {/* Grid de indicadores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="w-full md:w-80">
                <TotalSales total={dashboardData.indicators.total_sales} />
              </div>
              <div className="w-full md:w-80">
                <SalesBySegmentUI
                  segments={dashboardData.indicators.sales_by_segment}
                />
              </div>
            </div>
            {/* Grid de tablas */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              <TopCustomersTable
                customers={dashboardData.tables.top_customers}
              />
              <TopProductsTable products={dashboardData.tables.top_products} />
            </div>
          </div>
        )}

        {/* Error */}
        {dashboardError && (
          <div className="text-red-600 font-semibold mt-4">
            {dashboardError}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
