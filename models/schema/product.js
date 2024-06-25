import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description:{
        type: String
    },
    longdescription:{ // FB: camel case로
        type: String
    },
    price:{
        type: Number
    },
    images: [{ 
        type: String
    }]
});

const Product = mongoose.model("Product", productSchema,);
export default Product;