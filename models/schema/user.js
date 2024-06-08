import { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
        type: String,
    },
    address: {
        type: new Schema(
            {
                postalCode: String,
                address: String,
            },
            {
                _id: false,
            }
        ),
    },
    description: {
      type: String,
      default: "설명이 아직 없습니다. 추가해 주세요.",
    },
  },
  {
    timestamps: true,
  }
);


export { UserSchema };