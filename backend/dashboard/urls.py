from django.urls import path
from . import views

urlpatterns = [
  #Indicadores
  path('indicators/total-sales', views.total_sales_view)
]
