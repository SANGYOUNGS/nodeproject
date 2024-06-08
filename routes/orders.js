import express from "express";
import ordersService from "../services/ordersService.js";
const router = express.Router();

// 주문 추가
router.post("/", async (req, res) => {
  try {
    const order = await ordersService.addOrder(req.body);
    res.json(order);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// 주문 조회
router.get("/", async (req, res) => {
  try {
    const orders = await ordersService.getOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// 주문 수정
router.put("/:id", async (req, res) => {
  try {
    const order = await ordersService.updateOrder(req.params.id, req.body);
    res.json(order);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// 주문 삭제
router.delete("/:id", async (req, res) => {
  try {
    await ordersService.deleteOrder(req.params.id);
    res.json({ msg: "Order removed" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

export default router;
