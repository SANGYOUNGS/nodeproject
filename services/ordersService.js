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
    session.endSession();

    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
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

const updateOrder = (id, address) => {
  Order.findById(id).then((order) => {
    console.log(order);
    if (!order) {
      console.log("hello");

      return res.json({ message: `주문을 찾을 수 없습니다.` });
    }
    if (order.orderState !== "주문완료") {
      return res.json({
        message: `주문완료 상태에서만 배송지변경이 가능합니다.`,
      });
    }
    order.address = address;
    order.save();

    return order;
  });
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
