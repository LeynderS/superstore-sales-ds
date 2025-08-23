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

# Vista para obtener las ventas totales
def total_sales_view(request):
    filters = build_filters(request)
    return JsonResponse({"total_sales": get_total_sales(filters)})

# Vista para obtener las ventas por segmento
def sales_by_segment_view(request):
    filters = build_filters(request)
    return JsonResponse(get_sales_by_segment(filters), safe=False)

# Vista para obtener los clientes top
def top_customers_view(request):
    filters = build_filters(request)
    limit = int(request.GET.get("limit", 10))
    return JsonResponse(get_top_customers(filters, limit), safe=False)
  
# Vista para obtener los productos top
def top_products_view(request):
    filters = build_filters(request)
    limit = int(request.GET.get("limit", 20))
    return JsonResponse(get_top_products(filters, limit), safe=False)
  
# Vista para obtener las ventas a lo largo del tiempo
def sales_over_time_view(request):
    filters = build_filters(request)
    return JsonResponse(get_sales_over_time(filters), safe=False)
  
# Vista para obtener las ventas por categoría
def sales_by_category_view(request):
    filters = build_filters(request)
    return JsonResponse(get_sales_by_category(filters), safe=False)