from django.http import JsonResponse
from .filters_builder import build_sql_filters as build_filters
from .repositories import (
  get_total_sales,
  get_sales_by_segment,
  get_top_customers,
  get_top_products,
  get_sales_over_time,
  get_sales_by_category,
)
from .filters import (
  get_categories_with_subcategories,
  get_states_with_cities,
  get_date_orders_range
)
  
#-----Data para el dashboard----#
def dashboard_data_view(request):
    filters = build_filters(request)

    data = {
        "indicators": {
            "total_sales": get_total_sales(filters),
            "sales_by_segment": get_sales_by_segment(filters),
        },
        "tables": {
            "top_customers": get_top_customers(filters, limit=10),
            "top_products": get_top_products(filters, limit=20),
        },
        "charts": {
            "sales_over_time": get_sales_over_time(filters),
            "sales_by_category": get_sales_by_category(filters),
        }
    }
    return JsonResponse(data, safe=False)
  
#------FILTROS-------#
def filters_init_view(request):
    categories = get_categories_with_subcategories()
    states = get_states_with_cities()
    date_range = get_date_orders_range()
    return JsonResponse({
        "start_date_range": date_range["start_date"],
        "end_date_range": date_range["end_date"],
        "categories": categories,
        "states": states,
    }, safe=False)