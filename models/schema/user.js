import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';

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
      type: Number,
      required: false,
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

const User = model("User", UserSchema);

export default User;