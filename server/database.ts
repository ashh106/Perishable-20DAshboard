import sqlite3 from "sqlite3";
import { promisify } from "util";

// Initialize SQLite database
const db = new sqlite3.Database("./walmart_perishables.db");

// Promisify database methods
const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db));

// Database initialization
export async function initializeDatabase() {
  try {
    // Create tables
    await dbRun(`
      CREATE TABLE IF NOT EXISTS stores (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        region TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await dbRun(`
      CREATE TABLE IF NOT EXISTS inventory_items (
        id TEXT PRIMARY KEY,
        store_id TEXT NOT NULL,
        sku TEXT NOT NULL,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        origin TEXT NOT NULL,
        bottled_date DATE NOT NULL,
        best_by_date DATE NOT NULL,
        current_price REAL NOT NULL,
        quantity_on_hand INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (store_id) REFERENCES stores (id)
      )
    `);

    await dbRun(`
      CREATE TABLE IF NOT EXISTS sales_data (
        id TEXT PRIMARY KEY,
        store_id TEXT NOT NULL,
        item_id TEXT NOT NULL,
        quantity_sold INTEGER NOT NULL,
        sale_price REAL NOT NULL,
        discount_percent REAL DEFAULT 0,
        sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (store_id) REFERENCES stores (id),
        FOREIGN KEY (item_id) REFERENCES inventory_items (id)
      )
    `);

    await dbRun(`
      CREATE TABLE IF NOT EXISTS markdown_rules (
        id TEXT PRIMARY KEY,
        store_id TEXT NOT NULL,
        base_discount REAL NOT NULL,
        multiplier REAL NOT NULL,
        max_discount REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (store_id) REFERENCES stores (id)
      )
    `);

    await dbRun(`
      CREATE TABLE IF NOT EXISTS customer_feedback (
        id TEXT PRIMARY KEY,
        store_id TEXT NOT NULL,
        customer_name TEXT,
        usage_type TEXT NOT NULL,
        quantity_preference TEXT NOT NULL,
        feedback TEXT,
        rating INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (store_id) REFERENCES stores (id)
      )
    `);

    await dbRun(`
      CREATE TABLE IF NOT EXISTS demand_forecasts (
        id TEXT PRIMARY KEY,
        store_id TEXT NOT NULL,
        item_category TEXT NOT NULL,
        forecast_date DATE NOT NULL,
        predicted_demand REAL NOT NULL,
        actual_demand REAL,
        confidence REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (store_id) REFERENCES stores (id)
      )
    `);

    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'associate',
        store_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (store_id) REFERENCES stores (id)
      )
    `);

    console.log("Database initialized successfully");

    // Seed initial data
    await seedInitialData();
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}

async function seedInitialData() {
  try {
    // Check if stores already exist
    const existingStores = await dbAll("SELECT COUNT(*) as count FROM stores");
    if (existingStores[0]?.count > 0) {
      console.log("Database already seeded");
      return;
    }

    // Seed stores
    const stores = [
      {
        id: "1234",
        name: "Supercenter #1234",
        location: "Dallas, TX",
        region: "North Texas",
      },
      {
        id: "5678",
        name: "Supercenter #5678",
        location: "Austin, TX",
        region: "Central Texas",
      },
      {
        id: "9012",
        name: "Supercenter #9012",
        location: "Houston, TX",
        region: "Southeast Texas",
      },
      {
        id: "3456",
        name: "Supercenter #3456",
        location: "San Antonio, TX",
        region: "South Texas",
      },
      {
        id: "7890",
        name: "Supercenter #7890",
        location: "Fort Worth, TX",
        region: "North Texas",
      },
    ];

    for (const store of stores) {
      await dbRun(
        "INSERT OR REPLACE INTO stores (id, name, location, region) VALUES (?, ?, ?, ?)",
        [store.id, store.name, store.location, store.region],
      );
    }

    // Seed sample inventory items
    const items = [
      {
        id: "mlk-001",
        store_id: "1234",
        sku: "MLK-001",
        name: "Whole Milk 1 Gallon",
        category: "Dairy",
        origin: "Green Valley Farm",
        bottled_date: "2025-01-15",
        best_by_date: "2025-01-18",
        current_price: 4.99,
        quantity_on_hand: 24,
      },
      {
        id: "mlk-002",
        store_id: "1234",
        sku: "MLK-002",
        name: "2% Milk 1 Gallon",
        category: "Dairy",
        origin: "Sunset Dairy Co.",
        bottled_date: "2025-01-14",
        best_by_date: "2025-01-19",
        current_price: 4.79,
        quantity_on_hand: 18,
      },
    ];

    for (const item of items) {
      await dbRun(
        `INSERT OR REPLACE INTO inventory_items 
         (id, store_id, sku, name, category, origin, bottled_date, best_by_date, current_price, quantity_on_hand) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.store_id,
          item.sku,
          item.name,
          item.category,
          item.origin,
          item.bottled_date,
          item.best_by_date,
          item.current_price,
          item.quantity_on_hand,
        ],
      );
    }

    // Seed markdown rules
    await dbRun(
      "INSERT OR REPLACE INTO markdown_rules (id, store_id, base_discount, multiplier, max_discount) VALUES (?, ?, ?, ?, ?)",
      ["rule-1234", "1234", 20, 1.0, 50],
    );

    console.log("Initial data seeded successfully");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

export { db, dbRun, dbGet, dbAll };
