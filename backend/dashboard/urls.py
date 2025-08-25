from django.urls import path
from . import views

urlpatterns = [  
  #Endpoint para traer data necesaria para el dashboard
  path("dashboard/data/", views.dashboard_data_view),

  #Filtros
  path("filters/init/", views.filters_init_view),
]
