import React from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFilterOptions } from "../hooks/useFilteredOptions";
import { useFilters } from "../hooks/useFilters";
import "../styles/react-select.css";

const Filters: React.FC = () => {
  const {
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
  } = useFilterOptions();
  const { fetchDashboardData } = useFilters();

  if (loading) {
    return <p className="text-red-600">Cargando filtros...</p>;
  }

  if (!initialFilters) {
    return (
      <p className="text-red-600">
        Error: No se pudieron cargar los filtros iniciales.
      </p>
    );
  }

  const minDate = new Date(initialFilters.start_date_range);
  const maxDate = new Date(initialFilters.end_date_range);

  const parseLocalDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const customSelectStyle = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: state.isFocused ? "#f87171" : "#d1d5db",
      "&:hover": { borderColor: "#f87171" },
      borderRadius: "0.5rem",
      boxShadow: state.isFocused ? "0 0 0 2px #fca5a5" : "none",
    }),
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-red-800 mb-2">
          Fecha Inicio (YYYY-MM-DD)
        </label>
        <DatePicker
          selected={
            selectedFilters.start_date
              ? parseLocalDate(selectedFilters.start_date)
              : null
          }
          onChange={handleStartDateChange}
          dateFormat="yyyy-MM-dd"
          className="w-full p-2 border border-red-200 rounded-md focus:ring-2 focus:ring-red-400 focus:border-red-400"
          placeholderText="Selecciona fecha inicio"
          minDate={minDate}
          maxDate={maxDate}
          isClearable={true}
          showMonthDropdown
          showYearDropdown
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-red-800 mb-2">
          Fecha Fin (YYYY-MM-DD)
        </label>
        <DatePicker
          selected={
            selectedFilters.end_date
              ? parseLocalDate(selectedFilters.end_date)
              : null
          }
          onChange={handleEndDateChange}
          dateFormat="yyyy-MM-dd"
          className="w-full p-2 border border-red-200 rounded-md focus:ring-2 focus:ring-red-400 focus:border-red-400"
          placeholderText="Selecciona fecha fin"
          minDate={minDate}
          maxDate={maxDate}
          isClearable={true}
          showMonthDropdown
          showYearDropdown
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-red-800 mb-2">
          Categorías
        </label>
        <Select
          isMulti
          options={categoryOptions}
          onChange={handleCategoryChange}
          classNamePrefix="select"
          className="w-full"
          placeholder="Selecciona categorías"
          styles={customSelectStyle}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-red-800 mb-2">
          Subcategorías
        </label>
        <Select
          isMulti
          options={availableSubcategories}
          value={availableSubcategories.filter((opt) =>
            selectedFilters.sub_category_ids.includes(opt.value)
          )}
          onChange={handleSubcategoryChange}
          classNamePrefix="select"
          className="w-full"
          placeholder="Selecciona subcategorías"
          isDisabled={selectedFilters.category_ids.length === 0}
          styles={customSelectStyle}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-red-800 mb-2">
          Estados
        </label>
        <Select
          isMulti
          options={stateOptions}
          onChange={handleStateChange}
          classNamePrefix="select"
          className="w-full"
          placeholder="Selecciona estados"
          styles={customSelectStyle}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-red-800 mb-2">
          Ciudades
        </label>
        <Select
          isMulti
          options={availableCities}
          value={availableCities.filter((opt) =>
            selectedFilters.cities.includes(opt.value)
          )}
          onChange={handleCityChange}
          classNamePrefix="select"
          className="w-full"
          placeholder="Selecciona ciudades"
          isDisabled={selectedFilters.state_ids.length === 0}
          styles={customSelectStyle}
        />
      </div>

      <div className="flex justify-end">
        <button
          className="bg-red-400 text-white px-4 py-2 rounded-md hover:bg-red-500 transition-colors duration-200 cursor-pointer"
          onClick={() => fetchDashboardData(selectedFilters)}
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
};

export default Filters;
