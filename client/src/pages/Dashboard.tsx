import React from "react";
import Filters from "../components/Filters";
import { useFilters } from "../hooks/useFilters";

const Dashboard: React.FC = () => {
  const { loading, error } = useFilters();

  if (loading)
    return <div className="text-center py-10">Cargando filtros...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Control de Mando Superstore</h1>
      <Filters />
    </div>
  );
};

export default Dashboard;
