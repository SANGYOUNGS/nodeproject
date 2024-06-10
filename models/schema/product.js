import mongoose from 'mongoose';

const { Schema } = mongoose;

const sizeSchema = new Schema({
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  }
});

// 변형(색상 및 사이즈) 스키마 정의
const variantSchema = new Schema({
  color: {
    type: String,
    required: true,
  },
  sizes: [sizeSchema] // 여러 사이즈를 포함
});

// 상품 스키마 정의
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
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
  description: {
    type: String,
    required: true,
  },
  longdescription: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
  }],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  variants: [variantSchema],
});

const Product = mongoose.model("Product", productSchema,);

export { variantSchema };
export default Product;