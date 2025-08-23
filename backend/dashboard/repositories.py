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
  
# Obtener las ventas por segmento usando los filtros
def get_sales_by_segment(filters):
    sql = f"""
        SELECT s.name, SUM(od.sales) AS total_sales
        FROM order_details od
        JOIN orders o ON od.order_id = o.id
        JOIN customers cu ON o.customer_id = cu.id
        JOIN segments s ON cu.segment_id = s.id
        {filters['joins'].replace("JOIN orders o ON od.order_id = o.id","")} 
        {filters['where']}
        GROUP BY s.name
        ORDER BY total_sales DESC
    """
    return [{"segment": r[0], "total_sales": float(r[1])} for r in fetchall(sql, filters["params"])]
