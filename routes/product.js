import express from "express";
import mongoose from "mongoose";
import Product from "../models/schema/product.js";
import Brand from "../models/schema/brand.js";
import Category from "../models/schema/category.js";
import Variant from "../models/schema/variant.js"; // Variant �� �߰�

const router = express.Router();

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
    const product = await Product.findById(productId)
      .populate("brand")
      .populate("category");

    if (!product) {
      return res.status(404).json({ message: "��ǰ�� ã�� �� �����ϴ�." });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res
      .status(500)
      .json({ message: "���� ������ ���� ��ǰ�� ������ �� �����ϴ�." });
  }
});

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
    res
      .status(500)
      .json({ message: "���� ������ ���� ��ǰ�� ������ �� �����ϴ�." });
  }
});

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
      return res.status(404).json({ message: "��ǰ�� ã�� �� �����ϴ�." });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ message: "���� ������ ���� ��ǰ�� ������Ʈ�� �� �����ϴ�." });
  }
});

router.delete("/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "��ǰ�� ã�� �� �����ϴ�." });
    }

    res.status(200).json({ message: "��ǰ�� ���������� �����Ǿ����ϴ�." });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ message: "���� ������ ���� ��ǰ�� ������ �� �����ϴ�." });
  }
});

export default router;
