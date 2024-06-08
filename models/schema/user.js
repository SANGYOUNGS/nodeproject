<<<<<<< HEAD
import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      default: () => Math.random().toString(36).substr(2, 9) // 서버에서 자동 생성
    },
=======
import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
>>>>>>> feature-login
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
<<<<<<< HEAD
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
                _id: false,
            }
        ),
        required: false,
=======
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
>>>>>>> feature-login
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

<<<<<<< HEAD
const UserModel = model("User", UserSchema);

export default UserModel;
=======
const User = model("User", UserSchema);

export default User;
>>>>>>> feature-login
