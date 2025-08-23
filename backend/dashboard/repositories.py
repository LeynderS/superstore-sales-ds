from django.db import connection

# Funcion de utilidad para ejecutar consultas y devolver todos los resultados
def fetchall(query, params=None):
    with connection.cursor() as cur:
        cur.execute(query, params or [])
        return cur.fetchall()
      
# Obtener las ventas totals usando los filtros
def get_total_sales(filters):
    sql = f"""
        SELECT COALESCE(SUM(od.sales), 0)
        FROM order_details od
        {filters['joins']}
        {filters['where']}
    """
    rows = fetchall(sql, filters["params"])
    return float(rows[0][0]) if rows else 0.0