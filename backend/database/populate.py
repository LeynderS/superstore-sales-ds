import pandas as pd
import psycopg2
from psycopg2.extras import execute_values
import os
from dotenv import load_dotenv

load_dotenv()

# Parámetros de conexión a la base de datos
db_params = {
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT')
}

# Cargar el conjunto de datos
file_path = "database/superstore_final_dataset.csv"
df = pd.read_csv(file_path, encoding="ISO-8859-1", dtype={"Postal_Code": str})

# Establecer conexión a base de datos
conn = psycopg2.connect(**db_params)
cur = conn.cursor()

# Función para obtener o insertar ID
def get_or_insert_id(table, column, value, cur, extra_conditions=None):
    if value is None or pd.isna(value):
        return None
    
    select_query = f"SELECT id FROM {table} WHERE {column} = %s"
    params = [value]
    
    if extra_conditions:
        for k, v in extra_conditions.items():
            if v is None:  # 👈 manejar NULL
                select_query += f" AND {k} IS NULL"
            else:
                select_query += f" AND {k} = %s"
                params.append(v)
    
    cur.execute(select_query, params)
    result = cur.fetchone()
    if result:
        return result[0]
    return None


# Insertar regiones
regions = df['Region'].unique()
execute_values(
    cur,
    "INSERT INTO regions (name) VALUES %s ON CONFLICT (name) DO NOTHING",
    [(region,) for region in regions if pd.notna(region)]
)

# Insertar estados
states = df[['State', 'Region']].drop_duplicates()
for _, row in states.iterrows():
    region_id = get_or_insert_id('regions', 'name', row['Region'], cur)
    if region_id:
        cur.execute(
            "INSERT INTO states (name, region_id) VALUES (%s, %s) ON CONFLICT (name) DO NOTHING",
            (row['State'], region_id)
        )

# Insertar ubicaciones
locations = df[['Country', 'City', 'State', 'Postal_Code']].drop_duplicates()
for _, row in locations.iterrows():
    state_id = get_or_insert_id('states', 'name', row['State'], cur)
    if state_id:
        postal_code = str(row['Postal_Code']) if pd.notna(row['Postal_Code']) else None
        try:
            cur.execute(
                """
                INSERT INTO locations (country, city, state_id, postal_code)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (city, state_id, postal_code) DO NOTHING
                """,
                (row['Country'], row['City'], state_id, postal_code)
            )
        except psycopg2.errors.UniqueViolation:
            continue

# Insertar segmentos
segments = df['Segment'].unique()
execute_values(
    cur,
    "INSERT INTO segments (name) VALUES %s ON CONFLICT (name) DO NOTHING",
    [(segment,) for segment in segments if pd.notna(segment)]
)

# Insertar clientes
customers = df[['Customer_ID', 'Customer_Name', 'Segment']].drop_duplicates()
for _, row in customers.iterrows():
    segment_id = get_or_insert_id('segments', 'name', row['Segment'], cur)
    if segment_id:
        cur.execute(
            """
            INSERT INTO customers (id, name, segment_id)
            VALUES (%s, %s, %s)
            ON CONFLICT (id) DO NOTHING
            """,
            (row['Customer_ID'], row['Customer_Name'], segment_id)
        )

# Insertar categorías
categories = df['Category'].unique()
execute_values(
    cur,
    "INSERT INTO categories (name) VALUES %s ON CONFLICT (name) DO NOTHING",
    [(category,) for category in categories if pd.notna(category)]
)

# Insertar subcategorías
sub_categories = df[['Sub_Category', 'Category']].drop_duplicates()
for _, row in sub_categories.iterrows():
    category_id = get_or_insert_id('categories', 'name', row['Category'], cur)
    if category_id:
        cur.execute(
            """
            INSERT INTO sub_categories (name, category_id)
            VALUES (%s, %s)
            ON CONFLICT (name) DO NOTHING
            """,
            (row['Sub_Category'], category_id)
        )

# Insertar productos
products = df[['Product_ID', 'Product_Name', 'Sub_Category']].drop_duplicates()
for _, row in products.iterrows():
    sub_category_id = get_or_insert_id('sub_categories', 'name', row['Sub_Category'], cur)
    if sub_category_id:
        cur.execute(
            """
            INSERT INTO products (id, name, sub_category_id)
            VALUES (%s, %s, %s)
            ON CONFLICT (id) DO NOTHING
            """,
            (row['Product_ID'], row['Product_Name'], sub_category_id)
        )

# Insertar modos de envío
ship_modes = df['Ship_Mode'].unique()
execute_values(
    cur,
    "INSERT INTO ship_modes (name) VALUES %s ON CONFLICT (name) DO NOTHING",
    [(ship_mode,) for ship_mode in ship_modes if pd.notna(ship_mode)]
)

# Insertar órdenes
orders = df[['Order_ID', 'Order_Date', 'Ship_Date', 'Ship_Mode', 'Customer_ID', 'Country', 'City', 'State', 'Postal_Code']]
for _, row in orders.iterrows():
    ship_mode_id = get_or_insert_id('ship_modes', 'name', row['Ship_Mode'], cur)
    customer_id = get_or_insert_id('customers', 'id', row['Customer_ID'], cur)
    state_id = get_or_insert_id('states', 'name', row['State'], cur)
    postal_code = str(row['Postal_Code']) if pd.notna(row['Postal_Code']) else None
    location_id = get_or_insert_id('locations', 'city', row['City'], cur, 
                                 {'state_id': state_id, 'postal_code': postal_code})
    if ship_mode_id and customer_id and location_id:
        # Explicitamente convirtiendo DD-MM-YYYY a YYYY-MM-DD
        order_date = pd.to_datetime(row['Order_Date'], dayfirst=True).date()
        ship_date = pd.to_datetime(row['Ship_Date'], dayfirst=True).date()
        cur.execute(
            """
            INSERT INTO orders (id, order_date, ship_date, ship_mode_id, customer_id, location_id)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO NOTHING
            """,
            (row['Order_ID'], order_date, ship_date, ship_mode_id, customer_id, location_id)
        )

# Insertar detalles de órdenes
for _, row in df.iterrows():
    order_id = get_or_insert_id('orders', 'id', row['Order_ID'], cur)
    product_id = get_or_insert_id('products', 'id', row['Product_ID'], cur)
    if order_id and product_id:
        cur.execute(
            """
            INSERT INTO order_details (row_id, order_id, product_id, sales)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (row_id) DO NOTHING
            """,
            (row['Row_ID'], row['Order_ID'], row['Product_ID'], row['Sales'])
        )

# Commit y cerrar
conn.commit()
cur.close()
conn.close()

print("¡Datos importados con éxito!")