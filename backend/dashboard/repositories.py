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
        JOIN orders o ON od.order_id = o.id
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
        {filters['joins']} 
        {filters['where']}
        GROUP BY s.name
        ORDER BY total_sales DESC
    """
    return [{"segment": r[0], "total_sales": float(r[1])} for r in fetchall(sql, filters["params"])]

# Obtener los clientes top usando los filtros y el limite
def get_top_customers(filters, limit=10):
    sql = f"""
        SELECT cu.name, s.name AS segment, loc.city, st.name AS state, SUM(od.sales) AS total_sales
        FROM order_details od
        JOIN orders o ON od.order_id = o.id
        JOIN customers cu ON o.customer_id = cu.id
        JOIN segments s ON cu.segment_id = s.id
        JOIN locations loc ON o.location_id = loc.id
        JOIN states st ON loc.state_id = st.id
        {filters['joins']    
          .replace("JOIN locations loc ON o.location_id = loc.id", "")
          .replace("JOIN states st ON loc.state_id = st.id", "")
        }
        {filters['where']}
        GROUP BY cu.name, s.name, loc.city, st.name
        ORDER BY total_sales DESC
        LIMIT %s
    """
    params = filters["params"] + [limit]
    rows = fetchall(sql, params)
    return [
        {"customer": r[0], "segment": r[1], "city": r[2], "state": r[3], "total_sales": float(r[4])}
        for r in rows
    ]

# Obtener los 20 productos top en ventas
def get_top_products(filters, limit=20):
    sql = f"""
        SELECT p.id, c.name AS category, sc.name AS sub_category, p.name AS product_name, SUM(od.sales) AS total_sales
        FROM order_details od
        JOIN products p ON od.product_id = p.id
        JOIN sub_categories sc ON p.sub_category_id = sc.id
        JOIN categories c ON sc.category_id = c.id
        JOIN orders o ON od.order_id = o.id
        {filters['joins']
          .replace("JOIN products p ON od.product_id = p.id", "")
          .replace("JOIN sub_categories sc ON p.sub_category_id = sc.id", "")
          .replace("JOIN categories c ON sc.category_id = c.id", "")
        }
        {filters['where']}
        GROUP BY p.id, c.name, sc.name, p.name
        ORDER BY total_sales DESC
        LIMIT %s
    """
    params = filters["params"] + [limit]
    rows = fetchall(sql, params)
    return [
        {"product_id": r[0], "category": r[1], "sub_category": r[2], "product_name": r[3], "total_sales": float(r[4])}
        for r in rows
    ]

# Obtener las ventas a lo largo del tiempo
def get_sales_over_time(filters):
    sql = f"""
        SELECT o.order_date, SUM(od.sales) AS total_sales
        FROM order_details od
        JOIN orders o ON od.order_id = o.id
        {filters['joins']}
        {filters['where']}
        GROUP BY o.order_date
        ORDER BY o.order_date
    """
    return [{"date": str(r[0]), "total_sales": float(r[1])} for r in fetchall(sql, filters["params"])]
  
# Obtener las ventas por categoría
def get_sales_by_category(filters):
    sql = f"""
        SELECT c.name, SUM(od.sales) AS total_sales
        FROM order_details od
        JOIN products p ON od.product_id = p.id
        JOIN sub_categories sc ON p.sub_category_id = sc.id
        JOIN categories c ON sc.category_id = c.id
        JOIN orders o ON od.order_id = o.id
        {filters['joins']
          .replace("JOIN products p ON od.product_id = p.id","")
          .replace("JOIN sub_categories sc ON p.sub_category_id = sc.id","")
          .replace("JOIN categories c ON sc.category_id = c.id","")
        }
        {filters['where']}
        GROUP BY c.name
        ORDER BY total_sales DESC
    """
    return [{"category": r[0], "total_sales": float(r[1])} for r in fetchall(sql, filters["params"])]