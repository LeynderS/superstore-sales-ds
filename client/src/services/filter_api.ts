import axios from "axios";
import { type InitialFilters } from "../interfaces/filters";

export const fetchInitialFilters = async (): Promise<InitialFilters> => {
  try {
    const response = await axios.get(`/backend/api/v1/filters/init/`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error obteniendo los filtros iniciales:", error);
    throw error;
  }
};
