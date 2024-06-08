import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';

const guestSchema = new Schema(
    {
     guestEmail: {
        type: String,
        required: true,
     },
     guestPw: {
        type: String,
        required: true,
     },
     guestName: {
        type: String,
        required: true,
     },
     guestAdd: {
        type: String,
        required: false,
     },
     guestNum: {
        type: Number,
        required: true,
     },
     orderNum: {
        type: Number,
        required: false,
     }
});

const Guest = model("guest", guestSchema);

export default Guest; 