export interface SalesBySegment {
  segment: string;
  total_sales: number;
}

export interface TopCustomer {
  customer: string;
  segment: string;
  city: string;
  state: string;
  total_sales: number;
}

export interface TopProduct {
  product_id: string;
  category: string;
  sub_category: string;
  product_name: string;
  total_sales: number;
}

export interface SalesOverTime {
  date: string; // YYYY-MM-DD
  total_sales: number;
}

export interface SalesByCategory {
  category: string;
  total_sales: number;
}

export interface DashboardData {
  indicators: {
    total_sales: number;
    sales_by_segment: SalesBySegment[];
  };
  tables: {
    top_customers: TopCustomer[];
    top_products: TopProduct[];
  };
  charts: {
    sales_over_time: SalesOverTime[];
    sales_by_category: SalesByCategory[];
  };
}
