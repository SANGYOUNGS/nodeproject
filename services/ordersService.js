import Order from "../models/schema/order.js";

// 주문 추가
const addOrder = async (orderData) => {
  const order = new Order(orderData);
  await order.save();
  return order;
};

// 주문 조회
const getOrders = async () => {
  const orders = await Order.find();
  return orders;
};

// 주문 수정
const updateOrder = async (id, orderData) => {
  const order = await Order.findByIdAndUpdate(id, orderData, { new: true });
  return order;
};

// 주문 삭제
const deleteOrder = async (id) => {
  await Order.findByIdAndDelete(id);
};

export default {
  addOrder,
  getOrders,
  updateOrder,
  deleteOrder,
};
