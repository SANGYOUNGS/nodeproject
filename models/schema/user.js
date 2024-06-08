import mongoose from 'mongoose';
import { Schema, model } from "mongoose";

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
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

const User = model('User', UserSchema);

export default User;

