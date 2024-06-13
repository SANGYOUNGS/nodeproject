import Order from "../models/schema/order.js";
import Variant from "../models/schema/variant.js";

// 주문 추가
const addOrder = async (customerId, orderData) => {
  const { items, name, address, phone } = orderData;
  const orderDate = new Date();
  const orderState = "주문완료";

  // 재고 확인 및 업데이트
  for (const item of items) {
    const variant = await Variant.findById(item.item);
    if (!variant) {
      throw new Error("해당 옵션을 찾을 수 없습니다.");
    }

    if (variant.sizes[item.size] < item.quantity) {
      throw new Error(`재고가 부족합니다.`);
    }

    // 재고 업데이트
    variant.sizes[item.size] -= item.quantity;
    await variant.save();
  }
  const order = new Order({
    items,
    customerId,
    name,
    address,
    phone,
    orderDate: orderDate,
    orderState: orderState,
  });
  await order.save();

  return order;
};

// 주문 조회
const getOrders = async (id) => {
  const orders = await Order.find({ customerId: id }).populate({
    path: "items.item",
    populate: {
      path: "productId",
      model: "Product",
    },
  });
  return orders;
};

const getAllOrders = async () => {
  const orders = await Order.find().populate({
    path: "items.item",
    populate: {
      path: "productId",
      model: "Product",
    },
  });
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
  getAllOrders,
  updateOrder,
  deleteOrder,
};
