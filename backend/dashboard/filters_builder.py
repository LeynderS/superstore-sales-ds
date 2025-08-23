from typing import Dict, List, Tuple, Any
from django.db import connection

def build_sql_filters(request) -> Dict[str, Any]:
    """
    Construye piezas SQL para filtros dinámicos del dashboard.

    Retorna:
      {
        "joins":  str,   # e.g. "JOIN orders o ON od.order_id = o.id JOIN ..."
        "where":  str,   # e.g. "WHERE o.order_date >= %s AND st.id = ANY(%s)"
        "params": list,  # e.g. ["2025-01-01", [1,2,3]]
      }
    """
    query = request.GET

    start_date = query.get("start_date")
    end_date = query.get("end_date")

    category_ids = list(map(int, query.getlist("category_id")))
    subcategory_ids = list(map(int, query.getlist("sub_category_id")))
    state_ids = list(map(int, query.getlist("state_id")))
    city_names = query.getlist("city")

    join_clauses: List[str] = []
    
    where_clauses: List[str] = []
    param_values: List[Any] = []

    # Rango de fechas (incluyente)
    if start_date:
        where_clauses.append("o.order_date >= %s")
        param_values.append(start_date)

    if end_date:
        where_clauses.append("o.order_date <= %s")
        param_values.append(end_date)

    # Estado / Ciudad
    if state_ids or city_names:
        join_clauses.append("JOIN locations loc ON o.location_id = loc.id")
        join_clauses.append("JOIN states st ON loc.state_id = st.id")

    if state_ids:
        where_clauses.append("st.id = ANY(%s)")
        param_values.append(state_ids)

    if city_names:
        where_clauses.append("LOWER(loc.city) = ANY(%s)")
        param_values.append([c.lower() for c in city_names])

    # Categoría / Subcategoría
    if category_ids or subcategory_ids:
        join_clauses.append("JOIN products p ON od.product_id = p.id")
        join_clauses.append("JOIN sub_categories sc ON p.sub_category_id = sc.id")
        join_clauses.append("JOIN categories c ON sc.category_id = c.id")

    if category_ids:
        where_clauses.append("c.id = ANY(%s)")
        param_values.append(category_ids)

    if subcategory_ids:
        where_clauses.append("sc.id = ANY(%s)")
        param_values.append(subcategory_ids)

    # Eliminar JOINs duplicados manteniendo el orden
    unique_joins = " ".join(dict.fromkeys(join_clauses))

    return {
        "joins": unique_joins,
        "where": ("WHERE " + " AND ".join(where_clauses)) if where_clauses else "",
        "params": param_values,
    }


def fetch_all(sql: str, params: List[Any] | Tuple[Any, ...] | None = None):
    """
    Ejecuta la consulta y devuelve todas las filas.
    """
    with connection.cursor() as cursor:
        cursor.execute(sql, params or [])
        return cursor.fetchall()
