import express from "express";
import productService from "../services/adminService.js";
import Brand from "../models/schema/brand.js";
import Category from "../models/schema/category.js";
import { authenticationMiddleware, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/products", authenticationMiddleware, checkRole,  async (req, res) => {
  try {
    const { brand, category, ...productData } = req.body;

    const brandDoc = await Brand.findOne({ name: brand });
    if (!brandDoc) {
      return res.status(400).json({ message: "Invalid brand name" });
    }

    const categoryDoc = await Category.findOne({ name: category });
    if (!categoryDoc) {
      return res.status(400).json({ message: "Invalid category name" });
    }

    productData.brand = brandDoc._id;
    productData.category = categoryDoc._id;

    const newProduct = await productService.addProduct(productData);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

router.put("/products/:id",authenticationMiddleware, checkRole,  async (req, res) => {
  try {
    const updatedProduct = await productService.updateProduct(
      req.params.id,
      req.body
    );
    if (!updatedProduct) {
      return res.status(404).send("상품을 찾을 수 없습니다.");
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.delete("/products/:id", authenticationMiddleware, checkRole, async (req, res) => {
  try {
    const deletedProduct = await productService.deleteProduct(req.params.id);
    if (!deletedProduct) {
      return res.status(404).send("상품을 찾을 수 없습니다.");
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

export default router;
