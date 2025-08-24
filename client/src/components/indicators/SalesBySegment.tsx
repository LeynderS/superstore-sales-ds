import React from "react";
import { type SalesBySegment } from "../../interfaces/dashboard";

interface SalesBySegmentProps {
  segments: SalesBySegment[];
}

const SalesBySegmentUI: React.FC<SalesBySegmentProps> = ({ segments }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Ventas por Segmento</h3>
      <ul className="space-y-2">
        {segments.map((seg, index) => (
          <li key={index} className="flex justify-between">
            <span>{seg.segment}</span>
            <span className="font-bold">
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
