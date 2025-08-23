import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os
from dotenv import load_dotenv

load_dotenv()

DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")

# --- Conectarse a 'postgres' para crear/dropear la base ---
conn = psycopg2.connect(dbname="postgres", user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT)
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
cur = conn.cursor()

# Drop DB si existe
cur.execute(f"SELECT 1 FROM pg_database WHERE datname = '{DB_NAME}'")
if cur.fetchone():
    cur.execute(f"DROP DATABASE {DB_NAME}")
    print(f"Base de datos {DB_NAME} eliminada.")

# Crear DB
cur.execute(f"CREATE DATABASE {DB_NAME}")
print(f"Base de datos {DB_NAME} creada.")
cur.close()
conn.close()

# --- Conectarse a la nueva base ---
conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT)
cur = conn.cursor()

# --- Crear tablas ---
schema_sql = """
CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    region_id INTEGER NOT NULL,
    FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE RESTRICT
);

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    country VARCHAR(50) NOT NULL DEFAULT 'United States',
    city VARCHAR(50) NOT NULL,
    state_id INTEGER NOT NULL,
    postal_code VARCHAR(10),
    UNIQUE (city, state_id, postal_code),
    FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE RESTRICT
);

CREATE TABLE segments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL UNIQUE
);

CREATE TABLE customers (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    segment_id INTEGER NOT NULL,
    FOREIGN KEY (segment_id) REFERENCES segments(id) ON DELETE RESTRICT
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL UNIQUE
);

CREATE TABLE sub_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL UNIQUE,
    category_id INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

CREATE TABLE products (
    id VARCHAR(15) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sub_category_id INTEGER NOT NULL,
    FOREIGN KEY (sub_category_id) REFERENCES sub_categories(id) ON DELETE RESTRICT
);

CREATE TABLE ship_modes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL UNIQUE
);

CREATE TABLE orders (
    id VARCHAR(20) PRIMARY KEY,
    order_date DATE NOT NULL,
    ship_date DATE NOT NULL,
    ship_mode_id INTEGER NOT NULL,
    customer_id VARCHAR(10) NOT NULL,
    location_id INTEGER NOT NULL,
    FOREIGN KEY (ship_mode_id) REFERENCES ship_modes(id) ON DELETE RESTRICT,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE RESTRICT
);

CREATE TABLE order_details (
    row_id INTEGER PRIMARY KEY,
    order_id VARCHAR(20) NOT NULL,
    product_id VARCHAR(15) NOT NULL,
    sales NUMERIC(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- Índices para performance
CREATE INDEX idx_order_date ON orders(order_date);
CREATE INDEX idx_sales ON order_details(sales);
CREATE INDEX idx_category_id ON sub_categories(category_id);
CREATE INDEX idx_state_id ON locations(state_id);
"""

cur.execute(schema_sql)
conn.commit()

print("Tablas creadas.")
cur.close()
conn.close()
