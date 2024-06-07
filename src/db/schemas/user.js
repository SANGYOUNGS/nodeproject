import { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
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
        required: false,
    },
    address: {
        type: new Schema(
            {
                postalCode: String,
                address: String,
            },
            {
                id: false,
            }
        ),
        required: false,
    },
    description: {
      type: String,
      required: false,
      default: "설명이 아직 없습니다. 추가해 주세요.",
    },
  },
  {
    timestamps: true,
  }
);


export { UserSchema };