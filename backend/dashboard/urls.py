from django.urls import path
from . import views

urlpatterns = [
  #Indicadores
  path('indicators/total-sales', views.total_sales_view),
  path("indicators/sales-by-segment", views.sales_by_segment_view),

]
