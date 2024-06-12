import express from "express";
import mongoose from "mongoose";
import Product from "../models/schema/product.js";
import Brand from "../models/schema/brand.js";
import Category from "../models/schema/category.js";
import Variant from "../models/schema/variant.js";

const router = express.Router();

// 제품 목록 가져오기
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("brand")
      .populate("category");
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "제품 목록을 불러올 수 없습니다." });
  }
});

router.get("/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId).populate("category");

    if (!product) {
      return res.status(404).json({ message: "제품을 찾을 수 없습니다." });
    }

    const variants = await Variant.find({ productId: productId });

    res.status(200).json({ product, variants });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "제품을 불러올 수 없습니다." });
  }
});

// 제품 생성
router.post("/", async (req, res) => {
  const { name, brand, category, description, longdescription, price } =
    req.body;

  const newProduct = new Product({
    name,
    brand,
    category,
    description,
    longdescription,
    price,
  });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "제품을 생성할 수 없습니다." });
  }
});

// 제품 업데이트
router.put("/:productId", async (req, res) => {
  const { productId } = req.params;
  const updates = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
    })
      .populate("brand")
      .populate("category");

    if (!updatedProduct) {
      return res.status(404).json({ message: "제품을 찾을 수 없습니다." });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "제품을 업데이트할 수 없습니다." });
  }
});

// 제품 삭제
router.delete("/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "제품을 찾을 수 없습니다." });
    }

    res.status(200).json({ message: "제품이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "제품을 삭제할 수 없습니다." });
  }
});

export default router;
