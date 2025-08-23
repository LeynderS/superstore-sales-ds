from django.http import JsonResponse
from .filters_builder import build_sql_filters as build_filters
from .repositories import (
  get_total_sales,
  get_sales_by_segment
)

# Vista para obtener las ventas totales
def total_sales_view(request):
    filters = build_filters(request)
    return JsonResponse({"total_sales": get_total_sales(filters)})

# Vista para obtener las ventas por segmento
def sales_by_segment_view(request):
    filters = build_filters(request)
    return JsonResponse({"sales_by_segment": get_sales_by_segment(filters)}, safe=False)