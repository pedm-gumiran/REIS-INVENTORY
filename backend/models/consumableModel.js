const db = require('../config/db');

/* READ ALL */
exports.getAllConsumables = async () => {
  const [rows] = await db.execute('SELECT * FROM consumable_products ORDER BY created_at DESC');
  return rows;
};

/* READ ONE */
exports.getConsumableById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM consumable_products WHERE product_id = ?', [id]);
  return rows[0];
};

/* CREATE */
exports.createConsumable = async (product_id, item_description, category, unit, quantity, unit_cost) => {
  const [result] = await db.execute(
    'INSERT INTO consumable_products (product_id, item_description, category, unit, quantity, unit_cost, total_cost) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [product_id, item_description, category, unit, quantity, unit_cost, quantity * unit_cost]
  );
  return product_id;
};

/* UPDATE / EDIT */
exports.updateConsumable = async (id, item_description, category, unit, quantity, unit_cost) => {
  const [result] = await db.execute(
    'UPDATE consumable_products SET item_description = ?, category = ?, unit = ?, quantity = ?, unit_cost = ?, total_cost = ?, updated_at = CURRENT_TIMESTAMP WHERE product_id = ?',
    [item_description, category, unit, quantity, unit_cost, quantity * unit_cost, id]
  );
  return result.affectedRows;
};

/* DELETE */
exports.deleteConsumable = async (id) => {
  const [result] = await db.execute('DELETE FROM consumable_products WHERE product_id = ?', [id]);
  return result.affectedRows;
};

/* UPDATE QUANTITY */
exports.updateConsumableQuantity = async (id, quantity) => {
  // First get the current unit_cost to calculate total_cost
  const [currentProduct] = await db.execute('SELECT unit_cost FROM consumable_products WHERE product_id = ?', [id]);
  if (currentProduct.length === 0) {
    throw new Error('Product not found');
  }
  
  const unit_cost = currentProduct[0].unit_cost;
  const [result] = await db.execute(
    'UPDATE consumable_products SET quantity = ?, total_cost = ?, updated_at = CURRENT_TIMESTAMP WHERE product_id = ?',
    [quantity, quantity * unit_cost, id]
  );
  return result.affectedRows;
};

/* Helper function to generate product ID */
function generateProductId() {
  const prefix = 'CP';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
}

/* GET LOW STOCK ITEMS */
exports.getLowStockConsumables = async () => {
  const [rows] = await db.execute('SELECT * FROM consumable_products WHERE quantity <= reorder_level ORDER BY quantity ASC');
  return rows;
};
