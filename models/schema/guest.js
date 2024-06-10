import mongoose from 'mongoose';

const { Schema } = mongoose;

const GuestSchema = new Schema(
    {
     guestEmail: {
        type: String,
        required: true,
     },
     guestPassword: {
        type: String,
        required: true,
     },
     guestName: {
        type: String,
        required: true,
     },
     guestAddress: {
        type: String,
        required: false,
     },
     guestNumber: {
        type: Number,
        required: true,
     },
     orderNumber: {
        type: Number,
        required: false,
     }
});

const Guest = mongoose.model("Guest", GuestSchema);

export default Guest; 