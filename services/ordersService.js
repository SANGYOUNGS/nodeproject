import mongoose from "mongoose";
import Order from "../models/schema/order.js";
import Variant from "../models/schema/variant.js";

const addOrder = async (customerId, items, name, address, phone) => {
  const orderDate = new Date();
  const orderState = "주문완료";

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const orderItems = [];
    for (const orderItem of items) {
      const { productId, size, color, quantity } = orderItem;

      const variant = await Variant.findOne({ productId, color }).session(
        session
      );
      if (!variant) {
        throw new Error("해당 옵션을 찾을 수 없습니다.");
      }

      if (variant.sizes[size] < quantity) {
        throw new Error(`재고가 부족합니다.`);
      }

      variant.sizes[size] -= quantity;
      await variant.save({ session });

      orderItems.push({
        item: variant._id,
        size,
        quantity,
      });
    }

    const order = new Order({
      customerId,
      name,
      address,
      phone,
      items: orderItems,
      orderState: orderState,
      orderDate: orderDate,
    });

    await order.save({ session });

    await session.commitTransaction();

    return order;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

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

const updateOrder = async (id, address, orderState) => {
  try {
    const order = await Order.findById(id);
    if (!order) {
      return { message: "주문을 찾을 수 없습니다.", success: false };
    }
    if (orderState) {
      order.orderState = orderState;
    }
    if (address) {
      if (order.orderState !== "주문완료") {
        return {
          message: "주문완료 상태에서만 배송지변경이 가능합니다.",
          success: false,
        };
      }
      order.address = address;
    }
    await order.save();
    return { message: "주문이 성공적으로 변경되었습니다.", success: true };
  } catch (error) {
    throw new Error("주문 업데이트 실패", {
      cause: error,
    });
  }
};

const deleteOrder = async (id) => {
  const order = await Order.findByIdAndDelete(id);

  return order;
};

export default {
  addOrder,
  getOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
};
