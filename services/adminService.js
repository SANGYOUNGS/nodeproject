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
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedData,
      { new: true }
    );
    if (!updatedProduct) {
      throw new Error("해당 제품을 찾을 수 없습니다.");
    }
    return updatedProduct;
  } catch (err) {
    throw new Error("제품을 업데이트하는 중 오류가 발생했습니다.");
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
// 제품 합계 개수
const getTotalProducts = async () => {
  try {
    const totalProducts = await Product.countDocuments({});
    return totalProducts;
  } catch (error) {
    console.error("제품 합계을 찾지못했습니다.", error);
    throw error;
  }
};
// 브랜드 합계 개수
const getTotalBrands = async () => {
  try {
    const totalBrands = await Brand.countDocuments({});
    return totalBrands;
  } catch (error) {
    console.error("브랜드 합계를 찾지못했습니다", error);
    throw error;
  }
};
// 제품 총 개수
const getTotalStock = async () => {
  try {
    const variants = await Variant.find({});
    let totalStock = 0;

    variants.forEach(variant => {
      const sizes = variant.sizes;
      for (const size in sizes) {
        if (sizes.hasOwnProperty(size) && typeof sizes[size] === 'number') {
          totalStock += sizes[size];
        }
      }
    });

    return totalStock;
  } catch (error) {
    console.error("총 개수를 찾지못했습니다.:", error);
    throw error;
  }
};


export default {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getTotalProducts,
  getTotalBrands,
  getTotalStock,
};
