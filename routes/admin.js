import express from "express";
import productService from "../services/adminService.js";
import mongoose from "mongoose";
import Brand from "../models/schema/brand.js";
import Category from "../models/schema/category.js";
// import Order from "../models/schema/order.js" 추후 오더 구현시 사용
import {
  authenticationMiddleware,
  checkRole,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/products",
  authenticationMiddleware,
  checkRole,
  async (req, res, next) => {
    try {
      const { brandId, categoryId, ...productData } = req.body;
      // ObjectId 형식 검증
      if (!mongoose.Types.ObjectId.isValid(brandId)) {
        return res.status(400).json({ message: "브랜드를 찾을 수 없습니다" });
      }
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ message: "카테고리를 찾을수 없습니다." });
      }

      // 브랜드 ID 검증
      const brandDoc = await Brand.findById(brandId);
      if (!brandDoc) {
        return res.status(400).json({ message: "Invalid brand ID" });
      }

      // 카테고리 ID 검증
      const categoryDoc = await Category.findById(categoryId);
      if (!categoryDoc) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      // 필수 필드 검증
      if (!productData.name) {
        return res.status(400).json({ message: "이름을 입력해주세요" });
      }

      // 가격 검증
      if (
        productData.price !== undefined &&
        typeof productData.price !== "number"
      ) {
        return res.status(400).json({ message: "가격을 확인해주세요" });
      }

      productData.brand = brandDoc._id;
      productData.category = categoryDoc._id;

      const newProduct = await productService.addProduct(productData);
      res.status(201).json(newProduct);
    } catch (err) {
      next(err); //
    }
  }
);

router.put(
  "/products/:id",
  authenticationMiddleware,
  checkRole,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, price, description, brandId, categoryId, longdescription } =
        req.body;

      if (!mongoose.Types.ObjectId.isValid(brandId)) {
        return res
          .status(400)
          .json({ message: "해당 브랜드를 찾을수 없습니다." });
      }
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res
          .status(400)
          .json({ message: "해당 카테고리를 찾을수 없습니다." });
      }

      if (
        !name ||
        !price ||
        !description ||
        !brandId ||
        !categoryId ||
        !longdescription
      ) {
        const error = new Error("필수 입력항목을 확인해주세요.");
        error.statusCode = 400;
        throw error;
      }

      const updatedProduct = await productService.updateProduct(id, {
        name,
        price,
        description,
        brand: brandId,
        category: categoryId,
        longdescription,
      });

      if (!updatedProduct) {
        const error = new Error("상품을 찾을수 없습니다.");
        error.statusCode = 404;
        throw error;
      }

      res.json(updatedProduct);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/products/:id",
  authenticationMiddleware,
  checkRole,
  async (req, res, next) => {
    try {
      const deletedProduct = await productService.deleteProduct(req.params.id);
      if (!deletedProduct) {
        return res.status(404).send("상품을 찾을 수 없습니다.");
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

export default router;
