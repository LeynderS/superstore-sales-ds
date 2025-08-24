import { useState, useEffect, type ReactNode } from "react";
import { FiltersContext } from "../contexts/filtersContext";
import {
  type InitialFilters,
  type SelectedFilters,
} from "../interfaces/filters";
import { fetchInitialFilters } from "../services/filter_api";

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

  return (
    <FiltersContext.Provider
      value={{
        initialFilters,
        selectedFilters,
        setSelectedFilters,
        loading,
        error,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};
