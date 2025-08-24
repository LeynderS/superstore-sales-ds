import { useState, useEffect, type ReactNode } from "react";
import { FiltersContext } from "../contexts/filtersContext";
import {
  type InitialFilters,
  type SelectedFilters,
} from "../interfaces/filters";
import { fetchInitialFilters } from "../services/filter_api";
import { fetchDashboardData } from "../services/filter_api";
import { useCallback } from "react";
import { type DashboardData } from "../interfaces/dashboard";

export const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const [initialFilters, setInitialFilters] = useState<InitialFilters | null>(
    null
  );
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    category_ids: [],
    sub_category_ids: [],
    state_ids: [],
    cities: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [dashboardLoading, setDashboardLoading] = useState<boolean>(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  // Traer filtros iniciales
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const data = await fetchInitialFilters();
        console.log("Filtros iniciales cargados:", data);
        setInitialFilters(data);
      } catch (err) {
        console.error("Error loading initial filters:", err);
        setError("Error cargando los filtros iniciales");
      } finally {
        setLoading(false);
      }
    };
    loadFilters();
  }, []);

  // Función para traer dashboard (inicial o por filtro)
  const fetchDashboardDataCallback = useCallback(
    async (filters: SelectedFilters) => {
      setDashboardLoading(true);
      setDashboardError(null);
      try {
        const params = new URLSearchParams();
        if (filters.start_date) params.append("start_date", filters.start_date);
        if (filters.end_date) params.append("end_date", filters.end_date);
        filters.category_ids.forEach((id) =>
          params.append("category_id", id.toString())
        );
        filters.sub_category_ids.forEach((id) =>
          params.append("sub_category_id", id.toString())
        );
        filters.state_ids.forEach((id) =>
          params.append("state_id", id.toString())
        );
        filters.cities.forEach((city) => params.append("city", city));

        const data = await fetchDashboardData(params);
        setDashboardData(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setDashboardError("Error al cargar los datos del dashboard");
      } finally {
        setDashboardLoading(false);
      }
    },
    []
  );

  // Carga inicial de dashboard al iniciar la app
  useEffect(() => {
    fetchDashboardDataCallback(selectedFilters);
  }, []);

  return (
    <FiltersContext.Provider
      value={{
        initialFilters,
        selectedFilters,
        setSelectedFilters,
        loading,
        error,
        dashboardData,
        dashboardLoading,
        dashboardError,
        fetchDashboardData: fetchDashboardDataCallback,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};
