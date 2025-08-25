import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { type SalesByCategory } from "../../interfaces/dashboard";

interface SalesByCategoryChartProps {
  data: SalesByCategory[];
}

const SalesByCategoryChart: React.FC<SalesByCategoryChartProps> = ({
  data,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-red-100">
      <h3 className="text-lg font-semibold text-red-700 mb-2">
        Ventas por Categoría
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="category"
            stroke="#374151"
            tick={{ fill: "#374151" }}
          />
          <YAxis stroke="#374151" tick={{ fill: "#374151" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #d1d5db",
            }}
            itemStyle={{ color: "#b91c1c" }}
          />
          <Legend wrapperStyle={{ color: "#374151" }} />
          <Bar dataKey="total_sales" fill="#f87171" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesByCategoryChart;
