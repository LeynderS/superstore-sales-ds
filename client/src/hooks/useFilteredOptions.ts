import { useMemo } from "react";
import { type MultiValue } from "react-select";
import { useFilters } from "./useFilters";

export const useFilterOptions = () => {
  const { initialFilters, selectedFilters, setSelectedFilters, loading } =
    useFilters();

  // Opciones de categorías y estados
  const categoryOptions = useMemo(
    () =>
      initialFilters?.categories?.map((cat) => ({
        value: cat.id,
        label: cat.name,
      })) ?? [],
    [initialFilters?.categories]
  );

  const stateOptions = useMemo(
    () =>
      initialFilters?.states?.map((st) => ({
        value: st.id,
        label: st.name,
      })) ?? [],
    [initialFilters?.states]
  );

  // Opciones dependientes
  const availableSubcategories = useMemo(() => {
    if (!initialFilters?.categories || !selectedFilters.category_ids.length)
      return [];
    const selectedCats = initialFilters.categories.filter((cat) =>
      selectedFilters.category_ids.includes(cat.id)
    );
    return selectedCats.flatMap((cat) =>
      cat.subcategories.map((sub) => ({ value: sub.id, label: sub.name }))
    );
  }, [initialFilters?.categories, selectedFilters.category_ids]);

  const availableCities = useMemo(() => {
    if (!initialFilters?.states || !selectedFilters.state_ids.length) return [];
    const selectedStates = initialFilters.states.filter((st) =>
      selectedFilters.state_ids.includes(st.id)
    );
    return selectedStates.flatMap((st) =>
      st.cities.map((city) => ({
        value: city.name.toLowerCase(),
        label: city.name,
      }))
    );
  }, [initialFilters?.states, selectedFilters.state_ids]);

  // Handlers
  const handleCategoryChange = (
    selected: MultiValue<{ value: number; label: string }>
  ) => {
    const ids = selected.map((opt) => opt.value);

    // recalcular las subcategorías disponibles con las nuevas categorías seleccionadas
    const validSubcategories =
      initialFilters?.categories
        .filter((cat) => ids.includes(cat.id))
        .flatMap((cat) => cat.subcategories.map((sub) => sub.id)) ?? [];

    // mantener solo las que siguen siendo válidas
    const filteredSubcategories = selectedFilters.sub_category_ids.filter(
      (subId) => validSubcategories.includes(subId)
    );

    setSelectedFilters((prev) => ({
      ...prev,
      category_ids: ids,
      sub_category_ids: filteredSubcategories,
    }));
  };

  // Manejar cambios en las subcategorías
  const handleSubcategoryChange = (
    selected: MultiValue<{ value: number; label: string }>
  ) => {
    const ids = selected.map((opt) => opt.value);
    setSelectedFilters((prev) => ({ ...prev, sub_category_ids: ids }));
  };

  // Manejar cambios en los estados
  const handleStateChange = (
    selected: MultiValue<{ value: number; label: string }>
  ) => {
    const ids = selected.map((opt) => opt.value);

    // recalcular las ciudades disponibles con los nuevos estados seleccionados
    const validCities =
      initialFilters?.states
        .filter((st) => ids.includes(st.id))
        .flatMap((st) => st.cities.map((city) => city.name.toLowerCase())) ??
      [];

    // mantener solo las que siguen siendo válidas
    const filteredCities = selectedFilters.cities.filter((city) =>
      validCities.includes(city)
    );

    setSelectedFilters((prev) => ({
      ...prev,
      state_ids: ids,
      cities: filteredCities,
    }));
  };

  // Manejar cambios en las ciudades
  const handleCityChange = (
    selected: MultiValue<{ value: string; label: string }>
  ) => {
    const names = selected.map((opt) => opt.value);
    setSelectedFilters((prev) => ({ ...prev, cities: names }));
  };

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // Manejar cambios en las fechas
  const handleStartDateChange = (date: Date | null) => {
    const newStart = date ? formatDate(date) : undefined;
    setSelectedFilters((prev) => {
      // Asegurar que la fecha de inicio no sea posterior a la de fin
      if (newStart && prev.end_date && newStart > prev.end_date) {
        return { ...prev, start_date: newStart, end_date: undefined };
      }
      return { ...prev, start_date: newStart };
    });
  };

  const handleEndDateChange = (date: Date | null) => {
    const newEnd = date ? formatDate(date) : undefined;
    setSelectedFilters((prev) => {
      // Asegurar que la fecha de fin no sea anterior a la de inicio
      if (newEnd && prev.start_date && newEnd < prev.start_date) {
        return { ...prev, end_date: newEnd, start_date: undefined };
      }
      return { ...prev, end_date: newEnd };
    });
  };

  return {
    initialFilters,
    selectedFilters,
    loading,
    categoryOptions,
    stateOptions,
    availableSubcategories,
    availableCities,
    handleCategoryChange,
    handleSubcategoryChange,
    handleStateChange,
    handleCityChange,
    handleStartDateChange,
    handleEndDateChange,
  };
};
