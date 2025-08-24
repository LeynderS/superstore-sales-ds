import React from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFilterOptions } from "../hooks/useFilteredOptions";

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

  // Renderizado condicional fuera de los hooks
  if (loading) {
    return <p>Cargando filtros...</p>;
  }

  if (!initialFilters) {
    return <p>Error: No se pudieron cargar los filtros iniciales.</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Filtros</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Rango de fechas */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Fecha Inicio (YYYY-MM-DD)
          </label>
          <DatePicker
            selected={
              selectedFilters.start_date
                ? new Date(selectedFilters.start_date)
                : null
            }
            onChange={handleStartDateChange}
            dateFormat="yyyy-MM-dd"
            className="w-full p-2 border rounded"
            placeholderText="Selecciona fecha inicio"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Fecha Fin (YYYY-MM-DD)
          </label>
          <DatePicker
            selected={
              selectedFilters.end_date
                ? new Date(selectedFilters.end_date)
                : null
            }
            onChange={handleEndDateChange}
            dateFormat="yyyy-MM-dd"
            className="w-full p-2 border rounded"
            placeholderText="Selecciona fecha fin"
          />
        </div>
        {/* Categorías */}
        <div>
          <label className="block text-sm font-medium mb-1">Categorías</label>
          <Select
            isMulti
            options={categoryOptions}
            onChange={handleCategoryChange}
            classNamePrefix="select"
            placeholder="Selecciona categorías"
          />
        </div>
        {/* Subcategorías (dependientes) */}
        <div>
          <label className="block text-sm font-medium mb-1">
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
            placeholder="Selecciona subcategorías"
            isDisabled={selectedFilters.category_ids.length === 0}
          />
        </div>
        {/* Estados */}
        <div>
          <label className="block text-sm font-medium mb-1">Estados</label>
          <Select
            isMulti
            options={stateOptions}
            onChange={handleStateChange}
            classNamePrefix="select"
            placeholder="Selecciona estados"
          />
        </div>
        {/* Ciudades (dependientes) */}
        <div>
          <label className="block text-sm font-medium mb-1">Ciudades</label>
          <Select
            isMulti
            options={availableCities}
            value={availableCities.filter((opt) =>
              selectedFilters.cities.includes(opt.value)
            )}
            onChange={handleCityChange}
            classNamePrefix="select"
            placeholder="Selecciona ciudades"
            isDisabled={selectedFilters.state_ids.length === 0}
          />
        </div>

        <div className="col-span-full flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            // onClick={applyFilters}
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
