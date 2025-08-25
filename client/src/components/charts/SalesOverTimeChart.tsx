import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { type SalesOverTime } from "../../interfaces/dashboard";

interface SalesOverTimeChartProps {
  data: SalesOverTime[];
}

const SalesOverTimeChart: React.FC<SalesOverTimeChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-red-100">
      <h3 className="text-lg font-semibold text-red-700 mb-2">
        Línea de Tiempo: Fecha vs Venta
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#374151" tick={{ fill: "#374151" }} />
          <YAxis stroke="#374151" tick={{ fill: "#374151" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #d1d5db",
            }}
            itemStyle={{ color: "#b91c1c" }}
          />
          <Legend wrapperStyle={{ color: "#374151" }} />
          <Line
            type="monotone"
            dataKey="total_sales"
            stroke="#f87171"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesOverTimeChart;
