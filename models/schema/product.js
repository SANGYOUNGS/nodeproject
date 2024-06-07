import mongoose from "mongoose";

const { Schema } = mongoose;

const variantSchema = new Schema({
    variantId: {
        type: String,
        required: true,
    },
    color: {
        type: [String],
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 10,
    },
    images: {
        type: [String],
        required: true
    }
});

const productSchema = new Schema({
    productId: {
        type: String,
        required: true,
    },
    
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    brand_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BrandCategories',
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductCategories',
        required: true
    },
    color: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: [String],
        required: true,
    },
    variant: {
        type: variantSchema,
        required: true,
    },
    images: {
        type: String,
        required: true,
    }
});
const Product = mongoose.model("Product", productSchema,);

export { variantSchema };
export default Product;