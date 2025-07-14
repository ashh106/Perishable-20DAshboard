import { RequestHandler } from "express";
import { dbAll, dbGet, dbRun } from "../database.js";
import { v4 as uuidv4 } from "uuid";

export const getInventoryItems: RequestHandler = async (req, res) => {
  try {
    const { storeId } = req.params;
    const items = await dbAll(
      `SELECT 
        i.*,
        julianday(i.best_by_date) - julianday('now') as days_to_expiry,
        julianday('now') - julianday(i.bottled_date) as days_on_shelf
       FROM inventory_items i 
       WHERE i.store_id = ? 
       ORDER BY days_to_expiry ASC`,
      [storeId],
    );

    // Add status based on days to expiry
    const itemsWithStatus = items.map((item: any) => ({
      ...item,
      status:
        item.days_to_expiry <= 2
          ? "critical"
          : item.days_to_expiry <= 4
            ? "warning"
            : "good",
    }));

    res.json(itemsWithStatus);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ error: "Failed to fetch inventory items" });
  }
};

export const updateInventoryItem: RequestHandler = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity_on_hand, current_price } = req.body;

    await dbRun(
      "UPDATE inventory_items SET quantity_on_hand = ?, current_price = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [quantity_on_hand, current_price, itemId],
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating inventory:", error);
    res.status(500).json({ error: "Failed to update inventory item" });
  }
};

export const getExpiringItems: RequestHandler = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { daysThreshold = 5 } = req.query;

    const items = await dbAll(
      `SELECT 
        i.*,
        julianday(i.best_by_date) - julianday('now') as days_to_expiry,
        julianday('now') - julianday(i.bottled_date) as days_on_shelf
       FROM inventory_items i 
       WHERE i.store_id = ? 
       AND julianday(i.best_by_date) - julianday('now') <= ?
       ORDER BY days_to_expiry ASC`,
      [storeId, daysThreshold],
    );

    const itemsWithStatus = items.map((item: any) => ({
      ...item,
      status:
        item.days_to_expiry <= 2
          ? "critical"
          : item.days_to_expiry <= 4
            ? "warning"
            : "good",
    }));

    res.json(itemsWithStatus);
  } catch (error) {
    console.error("Error fetching expiring items:", error);
    res.status(500).json({ error: "Failed to fetch expiring items" });
  }
};

export const addInventoryItem: RequestHandler = async (req, res) => {
  try {
    const { storeId } = req.params;
    const {
      sku,
      name,
      category,
      origin,
      bottled_date,
      best_by_date,
      current_price,
      quantity_on_hand,
    } = req.body;

    const itemId = uuidv4();

    await dbRun(
      `INSERT INTO inventory_items 
       (id, store_id, sku, name, category, origin, bottled_date, best_by_date, current_price, quantity_on_hand) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        itemId,
        storeId,
        sku,
        name,
        category,
        origin,
        bottled_date,
        best_by_date,
        current_price,
        quantity_on_hand,
      ],
    );

    res.status(201).json({ id: itemId, success: true });
  } catch (error) {
    console.error("Error adding inventory item:", error);
    res.status(500).json({ error: "Failed to add inventory item" });
  }
};
