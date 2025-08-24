import React from "react";
import Filters from "../components/Filters";
import TotalSales from "../components/indicators/TotalSales";
import SalesBySegmentUI from "../components/indicators/SalesBySegment";
import { useFilters } from "../hooks/useFilters";

const Dashboard: React.FC = () => {
  const { dashboardData, dashboardError } = useFilters();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Control de Mando Superstore</h1>
      <Filters />
      {/* Grid de indicadores */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <TotalSales total={dashboardData.indicators.total_sales} />
          <SalesBySegmentUI
            segments={dashboardData.indicators.sales_by_segment}
          />
        </div>
      )}

      {/* Error */}
      {dashboardError && (
        <div className="text-red-600 font-semibold mt-4">{dashboardError}</div>
      )}
    </div>
  );
};

export default Dashboard;
