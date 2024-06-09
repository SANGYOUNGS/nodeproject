import mongoose from "mongoose";
import { variantSchema } from "./product.js"; // variantSchema를 import

const { Schema } = mongoose;

const orderSchema = new Schema({
  items: [
    {
      item: {
        type: variantSchema, // variantSchema를 여기서 사용
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  customerId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: new Schema(
      {
        postalCode: {
          type: String,
          required: true,
        },
        address1: {
          type: String,
          required: true,
        },
        address2: {
          type: String,
          required: false,
        },
      },
      {
        _id: false,
      }
    ),
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  orderDate: {
    // 변경된 필드 이름
    type: Date,
    required: true,
  },
  orderState: {
    // 변경된 필드 이름
    type: String,
    required: true,
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
