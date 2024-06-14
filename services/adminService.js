import Product from "../models/schema/product.js";
import Brand from "../models/schema/brand.js";
import Variant from "../models/schema/variant.js";

// 제품 조회
const getProducts = async () => {
  try {
    return await Product.find();
  } catch (err) {
    throw new Error("제품 목록을 가져오는 중 오류가 발생했습니다.");
  }
};

// 제품 추가
const addProduct = async (productData) => {
  try {
    console.log("Product data received for adding:", productData);
    const newProduct = new Product(productData);
    return await newProduct.save();
  } catch (err) {
    console.error("Error while saving product:", err);
    throw new Error("제품을 추가하는 중 오류가 발생했습니다.");
  }
};

// 제품 상세정보 업데이트
const updateProduct = async (productId, updatedData) => {
  const updates = {};
  const allowedUpdates = ['name', 'price', 'description', 'longdescription', 'brand', 'category', 'images'];

  for (const key of Object.keys(updatedData)) {
      if (allowedUpdates.includes(key)) {
          updates[key] = updatedData[key];
      }
  }

  try {
      const updatedProduct = await Product.findByIdAndUpdate(
          productId,
          updates,
          { new: true, runValidators: true }
      );

      if (!updatedProduct) {
          throw new Error('해당 제품을 찾을 수 없습니다.');
      }

      return updatedProduct;
  } catch (err) {
      throw new Error('제품을 업데이트하는 중 오류가 발생했습니다.');
  }
};

// 제품 삭제
const deleteProduct = async (productId) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      throw new Error("해당 제품을 찾을 수 없습니다.");
    }
    return deletedProduct;
  } catch (err) {
    throw new Error("제품을 삭제하는 중 오류가 발생했습니다.");
  }
};


export default {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
