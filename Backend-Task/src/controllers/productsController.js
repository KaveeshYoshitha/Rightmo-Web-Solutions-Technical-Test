import {
  findProductById,
  getAllProducts,
  updateProduct,
  deleteProductById,
  createProduct,
} from "../models/productsModel.js";

const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const rows = await getAllProducts();
    const products = [];
    rows.forEach((row) => {
      const product = {
        id: row.id,
        title: row.title,
        price: toNumber(row.price),
        description: row.description,
        category: row.category,
        image: row.product_image ?? row.image,
        rating: {
          rate: toNumber(row.rate),
          count: toNumber(row.rate_count),
        },
      };
      products.push(product);
    });

    res.status(200).json( products );
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get products by id
export const getProductsById = async (req, res) => {
  try {
    const { id } = req.params;

    const rows = await findProductById(id);

    const products = [];
    const product = {
      id: rows.id,
      title: rows.title,
      price: toNumber(rows.price),
      description: rows.description,
      category: rows.category,
      image: rows.product_image ?? rows.image,
      rating: {
        rate: toNumber(rows.rate),
        count: toNumber(rows.rate_count),
      },
    };
    products.push(product);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { title, price, description, category, image, rate, rate_count } =
      req.body;

    const { userId } = req.params;

    if (
      !title ||
      !price ||
      !description ||
      !category ||
      !image ||
      !rate ||
      !rate_count
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const result = await createProduct(
      title,
      price,
      description,
      category,
      image,
      rate,
      rate_count,
      userId,
    );

    res
      .status(201)
      .json({ message: "Product created", productId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  Update product
export const editProduct = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const { title, price, description, category, image, rate, rate_count } =
      req.body;

    if (
      !title ||
      !price ||
      !description ||
      !category ||
      !image ||
      !rate ||
      !rate_count
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = await findProductById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.user_id !== parseInt(userId)) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    // Update main product info
    await updateProduct(
      title,
      price,
      description,
      category,
      image,
      rate,
      rate_count,
      id,
      userId,
    );

    res.status(200).json({ message: "Product updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const existingProduct = await findProductById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (existingProduct.user_id !== parseInt(userId)) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    await deleteProductById(id, userId);

    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
