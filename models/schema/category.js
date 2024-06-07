import mongoose from "mongoose";

const BrandCategorySchema = new Schema({
  name: {
    type: String,
    required: true
  }
});
const BrandCategory = mongoose.model("BrandCategories", BrandCategorySchema);

const ProductCategorySchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

const ProductCategory = mongoose.model("ProductCategories", ProductCategorySchema);

export { BrandCategory, ProductCategory };
