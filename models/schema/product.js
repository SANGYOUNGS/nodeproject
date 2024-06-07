import { Schema } from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        productId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description:{
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            require: true,
        },
        category: {
            type: ???
        },
        variants: [VariantSchema];               
    }
);

const Product = mongoose.model("Products", ProductSchema);

module.exports = Product;