import React from "react";

interface TotalSalesProps {
  total: number;
}

const TotalSales: React.FC<TotalSalesProps> = ({ total }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Total Ventas</h3>
      <p className="text-3xl font-bold">
        ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
};

export default TotalSales;
