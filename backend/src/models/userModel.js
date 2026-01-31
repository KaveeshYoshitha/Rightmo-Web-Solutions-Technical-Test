import db from "../config/db.js";

export const getAllUsers = async (store_id) => {
  const [rows] = await db.query("SELECT id, username, email FROM users ", [
    store_id,
  ]);
  return rows;
};

export const findUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ? ", [
    email,
  ]);
  return rows[0];
};

export const createUser = async (username, email, hashedPassword) => {
  const [result] = await db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hashedPassword],
  );
  return result;
};
