import db from "../config/db.js";

export const findProductById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM products WHERE products.id = ? ",
    [id],
  );
  return rows[0];
};

export const getAllProducts = async () => {
  const [rows] = await db.query(`SELECT * FROM products; `);
  return rows;
};

export const createProduct = async (
  title,
  price,
  description,
  category,
  product_image,
  rate,
  rate_count,
  user_id,
) => {
  const [result] = await db.query(
    "INSERT INTO products (title,price,description,category,product_image,rate,rate_count,user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      title,
      price,
      description,
      category,
      product_image,
      rate,
      rate_count,
      user_id,
    ],
  );
  return result;
};

export const updateProduct = async (
  title,
  price,
  description,
  category,
  product_image,
  rate,
  rate_count,
  id,
  user_id,
) => {
  const [result] = await db.query(
    "UPDATE products SET title = ?, price = ?, description = ?, category = ?, product_image = ?, rate = ?, rate_count = ? WHERE id = ? AND user_id = ?",
    [
      title,
      price,
      description,
      category,
      product_image,
      rate,
      rate_count,
      id,
      user_id,
    ],
  );
  return result;
};

export const deleteProductById = async (id, user_id) => {
  const [result] = await db.query(
    "DELETE FROM products WHERE id = ? AND user_id = ?",
    [id, user_id],
  );
  return result;
};
