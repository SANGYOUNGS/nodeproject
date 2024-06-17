import express from "express";
import ordersService from "../services/ordersService.js";
import {
  authenticationMiddleware,
  checkRole,
} from "../middleware/authMiddleware.js";
const router = express.Router();

// 주문 추가
router.post("/", authenticationMiddleware, async (req, res) => {
  const { id } = res.locals.user;
  const { items, name, address, phone } = req.body;

  try {
    const order = await ordersService.addOrder(id, items, name, address, phone);
    res.status(201).json(order);
  } catch (err) {
    console.log(err);

    res.status(500).send("서버 에러가 발생했습니다");
  }
});

// 주문 조회
router.get("/", authenticationMiddleware, async (req, res) => {
  const { id, role } = res.locals.user;
  let orders;

  try {
    if (role == "admin") {
      orders = await ordersService.getAllOrders();
    } else {
      orders = await ordersService.getOrders(id);
    }
    res.json(orders);
  } catch (err) {
    res.status(500).send("서버 에러가 발생했습니다");
  }
});

// 주문 수정
router.put("/:id", authenticationMiddleware, async (req, res) => {
  const { id } = req.params;
  const { address } = req.body;

  try {
    await ordersService.updateOrder(id, address);
    res.status(200).json({ message: "배송지가 성공적으로 변경되었습니다." });
  } catch (err) {
    res.status(500).send("서버 에러가 발생했습니다");
  }
});

// 주문 삭제
router.delete("/:id", authenticationMiddleware, checkRole, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrder = await ordersService.deleteOrder(id);
    if (!deletedOrder) {
      return res.status(404).send("주문을 찾을 수 없습니다");
    }
    res.status(200).json({ message: "주문이 성공적으로 삭제되었습니다" });
  } catch (err) {
    res.status(500).send("서버 에러가 발생했습니다");
  }
});

export default router;
