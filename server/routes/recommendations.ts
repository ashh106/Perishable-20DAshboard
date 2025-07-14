import { RequestHandler } from "express";
import { dbAll, dbGet, dbRun } from "../database.js";
import { v4 as uuidv4 } from "uuid";

export const applyRecommendation: RequestHandler = async (req, res) => {
  try {
    const { storeId, sku, discountPct, originalPrice, newPrice } = req.body;

    if (!storeId || !sku || discountPct === undefined) {
      return res.status(400).json({
        error: "storeId, sku, and discountPct are required",
      });
    }

    const recommendationId = uuidv4();
    const timestamp = new Date().toISOString();

    // Update the inventory item with the new price
    await dbRun(
      `UPDATE inventory_items 
       SET current_price = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE store_id = ? AND sku = ?`,
      [newPrice || originalPrice * (1 - discountPct / 100), storeId, sku],
    );

    // Log the recommendation application
    await dbRun(
      `INSERT INTO markdown_rules (id, store_id, base_discount, multiplier, max_discount) 
       VALUES (?, ?, ?, ?, ?) 
       ON CONFLICT(id) DO UPDATE SET 
         base_discount = excluded.base_discount,
         multiplier = excluded.multiplier,
         max_discount = excluded.max_discount`,
      [recommendationId, storeId, discountPct, 1.0, 50],
    );

    // Get the updated item for real-time broadcast
    const updatedItem = await dbGet(
      `SELECT * FROM inventory_items WHERE store_id = ? AND sku = ?`,
      [storeId, sku],
    );

    res.json({
      success: true,
      recommendationId,
      timestamp,
      appliedDiscount: discountPct,
      newPrice: newPrice || originalPrice * (1 - discountPct / 100),
      item: updatedItem,
    });
  } catch (error) {
    console.error("Error applying recommendation:", error);
    res.status(500).json({ error: "Failed to apply recommendation" });
  }
};

export const getRecommendationHistory: RequestHandler = async (req, res) => {
  try {
    const { storeId } = req.params;

    const recommendations = await dbAll(
      `SELECT 
        mr.*,
        i.sku,
        i.name,
        i.current_price
       FROM markdown_rules mr
       LEFT JOIN inventory_items i ON mr.store_id = i.store_id
       WHERE mr.store_id = ?
       ORDER BY mr.created_at DESC
       LIMIT 50`,
      [storeId],
    );

    res.json(recommendations);
  } catch (error) {
    console.error("Error getting recommendation history:", error);
    res.status(500).json({ error: "Failed to get recommendation history" });
  }
};

export const getBulkRecommendations: RequestHandler = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { daysThreshold = 3 } = req.query;

    // Get items that need recommendations
    const items = await dbAll(
      `SELECT 
        i.*,
        julianday(i.best_by_date) - julianday('now') as days_to_expiry
       FROM inventory_items i 
       WHERE i.store_id = ? 
       AND julianday(i.best_by_date) - julianday('now') <= ?
       AND julianday(i.best_by_date) - julianday('now') > 0
       ORDER BY days_to_expiry ASC`,
      [storeId, daysThreshold],
    );

    // Generate AI recommendations for each item
    const recommendations = items.map((item: any) => {
      const daysLeft = Math.round(item.days_to_expiry);
      let recommendedDiscount = 10;
      let reasoning = "Standard markdown for expiring item";

      if (daysLeft <= 1) {
        recommendedDiscount = 30;
        reasoning = "Aggressive markdown needed - expires tomorrow";
      } else if (daysLeft <= 2) {
        recommendedDiscount = 20;
        reasoning = "Moderate markdown to ensure sale within 2 days";
      } else if (daysLeft <= 3) {
        recommendedDiscount = 15;
        reasoning = "Light markdown to start moving inventory";
      }

      return {
        itemId: item.id,
        sku: item.sku,
        name: item.name,
        daysToExpiry: daysLeft,
        currentPrice: item.current_price,
        recommendedDiscount,
        newPrice: Number(
          (item.current_price * (1 - recommendedDiscount / 100)).toFixed(2),
        ),
        reasoning,
        confidence: 85 + Math.random() * 10, // 85-95% confidence
        expectedSales: Math.min(
          item.quantity_on_hand,
          Math.ceil(item.quantity_on_hand * (recommendedDiscount / 100) * 2),
        ),
      };
    });

    res.json({
      storeId,
      totalItems: items.length,
      recommendations,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error getting bulk recommendations:", error);
    res.status(500).json({ error: "Failed to get bulk recommendations" });
  }
};
