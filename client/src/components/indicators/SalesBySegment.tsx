import React from "react";
import { type SalesBySegment } from "../../interfaces/dashboard";

interface SalesBySegmentProps {
  segments: SalesBySegment[];
}

const SalesBySegmentUI: React.FC<SalesBySegmentProps> = ({ segments }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-red-100">
      <h3 className="text-lg font-semibold text-red-700 mb-2">
        Ventas por Segmento
      </h3>
      <ul className="space-y-3">
        {segments.map((seg, index) => (
          <li key={index} className="flex justify-between items-center">
            <span className="text-gray-700">{seg.segment}</span>
            <span className="font-bold text-red-800">
              $
              {seg.total_sales.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SalesBySegmentUI;
