import { createContext } from "react";
import { type FiltersContextType } from "../interfaces/filters";

export const FiltersContext = createContext<FiltersContextType | undefined>(
  undefined
);
