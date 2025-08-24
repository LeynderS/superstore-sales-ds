export interface Subcategory {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  subcategories: Subcategory[];
}

export interface City {
  name: string;
}

export interface State {
  id: number;
  name: string;
  cities: City[];
}

export interface InitialFilters {
  categories: Category[];
  states: State[];
}

// interfaz para query params
export interface SelectedFilters {
  start_date?: string; // YYYY-MM-DD
  end_date?: string;
  category_ids: number[];
  sub_category_ids: number[];
  state_ids: number[];
  cities: string[]; // Nombres en lower case, como en filters_builder.py
}

export interface FiltersContextType {
  initialFilters: InitialFilters | null;
  selectedFilters: SelectedFilters;
  setSelectedFilters: React.Dispatch<React.SetStateAction<SelectedFilters>>;
  loading: boolean;
  error: string | null;
}
