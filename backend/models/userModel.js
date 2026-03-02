const db = require('../config/db');

/* READ ALL */
exports.getAllUsers = async () => {
  const [rows] = await db.execute('SELECT user_id, first_name, last_name, email FROM users');
  return rows;
};

/* READ ONE BY ID */
exports.getUserById = async (user_id) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE user_id = ?', [user_id]);
  return rows[0];
};

/* READ ONE BY EMAIL */
exports.getUserByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

/* CREATE */
exports.createUser = async ({ first_name, last_name, email, password, pin_code }) => {
  const [result] = await db.execute(
    'INSERT INTO users (first_name, last_name, email, password, pin_code) VALUES (?, ?, ?, ?, ?)',
    [first_name, last_name, email, password, pin_code],
  );
  return result.insertId;
};

/* UPDATE / EDIT */
exports.updateUser = async (user_id, first_name, last_name, email) => {
  const [result] = await db.execute(
    'UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE user_id = ?',
    [first_name, last_name, email, user_id],
  );
  return result.affectedRows;
};

/* DELETE */
exports.deleteUser = async (user_id) => {
  const [result] = await db.execute('DELETE FROM users WHERE user_id = ?', [user_id]);
  return result.affectedRows;
};

/* UPDATE RESET TOKEN */
exports.updateResetToken = async (user_id, resetToken, resetTokenExpiry) => {
  const [result] = await db.execute(
    'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE user_id = ?',
    [resetToken, resetTokenExpiry, user_id]
  );
  return result.affectedRows;
};

/* GET USER BY RESET TOKEN */
exports.getUserByResetToken = async (resetToken) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE reset_token = ?', [resetToken]);
  return rows[0];
};

/* UPDATE PASSWORD */
exports.updatePassword = async (user_id, hashedPassword) => {
  const [result] = await db.execute(
    'UPDATE users SET password = ? WHERE user_id = ?',
    [hashedPassword, user_id]
  );
  return result.affectedRows;
};

/* CLEAR RESET TOKEN */
exports.clearResetToken = async (user_id) => {
  const [result] = await db.execute(
    'UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE user_id = ?',
    [user_id]
  );
  return result.affectedRows;
};
