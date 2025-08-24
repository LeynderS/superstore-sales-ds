import axios from "axios";
import { type InitialFilters } from "../interfaces/filters";
import { type DashboardData } from "../interfaces/dashboard";

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

export const fetchDashboardData = async (
  params: URLSearchParams
): Promise<DashboardData> => {
  try {
    console.log(
      "Axios final URL:",
      `/backend/api/v1/dashboard/data?${params.toString()}`
    );
    const response = await axios.get(
      `http://localhost:8000/api/v1/dashboard/data`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: params,
      }
    );
    console.log("Dashboard data response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo los datos del dashboard:", error);
    throw error;
  }
};
