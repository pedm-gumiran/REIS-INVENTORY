const db = require('../config/db');

/* READ ALL */
exports.getAllNonConsumables = async () => {
  const [rows] = await db.execute('SELECT * FROM non_consumable_products ORDER BY created_at DESC');
  return rows;
};

/* READ ONE */
exports.getNonConsumableById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM non_consumable_products WHERE product_id = ?', [id]);
  return rows[0];
};

/* CREATE */
exports.createNonConsumable = async (product_id, item_description, category, unit, quantity, unit_cost, total_cost) => {
  const [result] = await db.execute(
    'INSERT INTO non_consumable_products (product_id, item_description, category, unit, quantity, unit_cost, total_cost) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [product_id, item_description, category, unit, quantity, unit_cost, total_cost]
  );
  return product_id;
};

/* UPDATE / EDIT */
exports.updateNonConsumable = async (id, item_description, category, unit, quantity, unit_cost, total_cost) => {
  const [result] = await db.execute(
    'UPDATE non_consumable_products SET item_description = ?, category = ?, unit = ?, quantity = ?, unit_cost = ?, total_cost = ?, updated_at = CURRENT_TIMESTAMP WHERE product_id = ?',
    [item_description, category, unit, quantity, unit_cost, total_cost, id]
  );
  return result.affectedRows;
};

/* DELETE */
exports.deleteNonConsumable = async (id) => {
  const [result] = await db.execute('DELETE FROM non_consumable_products WHERE product_id = ?', [id]);
  return result.affectedRows;
};

/* UPDATE CONDITION */
exports.updateNonConsumableCondition = async (id, condition) => {
  const [result] = await db.execute(
    'UPDATE non_consumable_products SET condition = ?, updated_at = CURRENT_TIMESTAMP WHERE product_id = ?',
    [condition, id]
  );
  return result.affectedRows;
};

/* UPDATE ASSIGNMENT */
exports.updateNonConsumableAssignment = async (id, assigned_to) => {
  const [result] = await db.execute(
    'UPDATE non_consumable_products SET assigned_to = ?, updated_at = CURRENT_TIMESTAMP WHERE product_id = ?',
    [assigned_to, id]
  );
  return result.affectedRows;
};

/* Helper function to generate product ID */
function generateProductId() {
  const prefix = 'EQ';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
}

/* GET BY LOCATION */
exports.getNonConsumablesByLocation = async (location) => {
  const [rows] = await db.execute('SELECT * FROM non_consumable_products WHERE location = ? ORDER BY name ASC', [location]);
  return rows;
};

/* GET BY ASSIGNED USER */
exports.getNonConsumablesByAssignedUser = async (assigned_to) => {
  const [rows] = await db.execute('SELECT * FROM non_consumable_products WHERE assigned_to = ? ORDER BY name ASC', [assigned_to]);
  return rows;
};

/* GET EXPIRING WARRANTY */
exports.getExpiringWarrantyItems = async (days = 30) => {
  const [rows] = await db.execute(
    'SELECT * FROM non_consumable_products WHERE warranty_expiry <= DATE_ADD(CURRENT_DATE, INTERVAL ? DAY) AND warranty_expiry >= CURRENT_DATE ORDER BY warranty_expiry ASC',
    [days]
  );
  return rows;
};

/* ADD RETURNED QUANTITY */
exports.addReturnedQuantity = async (productId, returnedQuantity) => {
  const [result] = await db.execute(
    'UPDATE non_consumable_products SET quantity = quantity + ?, updated_at = CURRENT_TIMESTAMP WHERE product_id = ?',
    [returnedQuantity, productId]
  );
  return result.affectedRows;
};

/* GET LOW STOCK ITEMS */
exports.getLowStockNonConsumables = async () => {
  const [rows] = await db.execute('SELECT * FROM non_consumable_products WHERE quantity <= 10 ORDER BY quantity ASC');
  return rows;
};
