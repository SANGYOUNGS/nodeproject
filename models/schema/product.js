import { Schema } from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
          },
          size: {
            type: String,
            required: true,
          },
          color: {
            type: String,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
    }
);

const Product = mongoose.model("Products", ProductSchema);

module.exports = Product;