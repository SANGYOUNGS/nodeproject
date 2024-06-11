import express from "express";
import productService from "../services/adminService.js";
import { authenticationMiddleware, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();


// 제품 추가
router.post('/api/admin/products',authenticationMiddleware, checkRole, async (req, res) => {
  try {
    const newProduct = await productService.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// 제품 수정
router.put('/api/admin/products/:id' ,authenticationMiddleware, checkRole, async (req, res) => {
  try {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);
    if (!updatedProduct) {
      return res.status(404).send("상품을 찾을 수 없습니다.");
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// 제품 삭제
router.delete('/api/admin/products/:id', authenticationMiddleware, checkRole, async (req, res) => {
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
