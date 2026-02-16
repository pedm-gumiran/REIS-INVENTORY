const db = require('../config/db');

/* READ ALL */
exports.getAllUsers = async () => {
  const [rows] = await db.execute('SELECT user_id, user_name FROM users');
  return rows;
};

/* READ ONE */
exports.getUserById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

/* CREATE */
exports.createUser = async (name, email, role) => {
  const [result] = await db.execute(
    'INSERT INTO users (name, email, role) VALUES (?, ?, ?)',
    [name, email, role],
  );
  return result.insertId;
};

/* UPDATE / EDIT */
exports.updateUser = async (id, name, email, role) => {
  const [result] = await db.execute(
    'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
    [name, email, role, id],
  );
  return result.affectedRows;
};

/* DELETE */
exports.deleteUser = async (id) => {
  const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows;
};
