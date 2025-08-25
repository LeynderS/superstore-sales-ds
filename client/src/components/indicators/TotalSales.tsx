import React from "react";

interface TotalSalesProps {
  total: number;
}

const TotalSales: React.FC<TotalSalesProps> = ({ total }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-red-100">
      <h3 className="text-lg font-semibold text-red-700 mb-2">Total Ventas</h3>
      <p className="text-3xl font-bold text-red-800">
        ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
};

export default TotalSales;
