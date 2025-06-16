import mongoose from "mongoose";
import Variant from "./variant.js"; // variantSchema를 import

const { Schema } = mongoose;

const orderSchema = new Schema({
  items: [
    {
      item: {
        type: Schema.Types.ObjectId,
        ref: "Variant", // variantSchema를 여기서 사용
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  customerId: {
    type: String,  // FB: ObjectId
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
        versionKey: false, // FB: new Schema를 사용하면 __v 필드가 생기는데 이를 없애기 위해 versionKey: false를 추가
      }
    ),
    required: true,
  },
  phone: {
    type: String,
    required: false,
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
