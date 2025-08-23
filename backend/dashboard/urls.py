from django.urls import path
from . import views

urlpatterns = [
  #Indicadores
  path('indicators/total-sales', views.total_sales_view),
  path("indicators/sales-by-segment", views.sales_by_segment_view),

  #Tablas
  path("tables/top-customers", views.top_customers_view),
  path("tables/top-products", views.top_products_view),

  #Gráficos
  path("charts/sales-over-time", views.sales_over_time_view),
  path("charts/sales-by-category", views.sales_by_category_view),
]
