import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// MySQL connection config — set via environment variables
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = parseInt(process.env.DB_PORT || "3306");
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "king_perfumes";

let pool = null;

export async function getPool() {
  if (pool) return pool;

  pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // Create tables if they don't exist
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      category VARCHAR(100) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      original_price DECIMAL(10,2) DEFAULT NULL,
      description TEXT NOT NULL,
      notes TEXT,
      top_notes VARCHAR(500) DEFAULT '',
      middle_notes VARCHAR(500) DEFAULT '',
      base_notes VARCHAR(500) DEFAULT '',
      how_to_use TEXT,
      images JSON NOT NULL,
      sizes JSON NOT NULL,
      gender VARCHAR(50) DEFAULT 'Unisex',
      stock INT NOT NULL DEFAULT 0,
      rating DECIMAL(3,1) DEFAULT 0,
      review_count INT DEFAULT 0,
      badge VARCHAR(50) DEFAULT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  try {
    await pool.execute(`ALTER TABLE products ADD COLUMN note_images JSON`);
  } catch (err) {
    // Column already exists or error ignored
  }

  try {
    await pool.execute(`ALTER TABLE products ADD COLUMN reviews JSON`);
  } catch (err) {
    // Column already exists or error ignored
  }

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(100) PRIMARY KEY,
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(50) NOT NULL,
      address TEXT NOT NULL,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(100) NOT NULL,
      pincode VARCHAR(20) NOT NULL,
      subtotal DECIMAL(10,2) NOT NULL,
      shipping DECIMAL(10,2) NOT NULL DEFAULT 0,
      total DECIMAL(10,2) NOT NULL,
      payment_method VARCHAR(50) NOT NULL,
      payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
      razorpay_order_id VARCHAR(100) DEFAULT NULL,
      razorpay_payment_id VARCHAR(100) DEFAULT NULL,
      order_status VARCHAR(50) NOT NULL DEFAULT 'Processing',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS order_items (
      id VARCHAR(100) PRIMARY KEY,
      order_id VARCHAR(100) NOT NULL,
      product_id VARCHAR(100) NOT NULL,
      product_name VARCHAR(255) NOT NULL,
      size VARCHAR(50) NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    )
  `);

  // Categories table
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      slug VARCHAR(255) NOT NULL UNIQUE,
      image VARCHAR(500) DEFAULT '',
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Contact messages table
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(500) DEFAULT '',
      message TEXT NOT NULL,
      is_read TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Settings table
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      setting_key VARCHAR(100) PRIMARY KEY,
      setting_value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Insert default settings if not exist
  await pool.execute(`
    INSERT IGNORE INTO settings (setting_key, setting_value) VALUES ('cod_percentage', '0')
  `);

  console.log("✅ MySQL connected — tables ready");
  return pool;
}

export async function queryAll(sql, params = []) {
  const p = await getPool();
  const [rows] = await p.execute(sql, params);
  return rows;
}

export async function queryOne(sql, params = []) {
  const rows = await queryAll(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export async function runQuery(sql, params = []) {
  const p = await getPool();
  const [result] = await p.execute(sql, params);
  return result;
}