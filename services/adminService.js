import Product from "../models/schema/product.js";
import Brand from "../models/schema/brand.js";
import Variant from "../models/schema/variant.js";

// 제품 조회
const getProducts = async (page, perPage) => {
  try {
    return await Product.find().skip(page * perPage).limit(perPage); // FB: Pagination을 구현합시다. limit, skip을 사용해서 가능.
  } catch (err) {
    // console.error("Error while fetching products:", err);
    throw new Error("제품 목록을 가져오는 중 오류가 발생했습니다.", {
      cause: err
    });
  }
};

// 제품 추가
const addProduct = async (productData) => {
  try {
    console.log("Product data received for adding:", productData);
    const newProduct = new Product(productData);
    return await newProduct.save().then((product) => product.toObject()); // FB: toObject를 사용하면 POJO를 얻을 수 있음.
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
      { 
        new: true,
        runValidators: true 
      }
    );
    if (updatedProduct === null) {
      throw new Error("해당 제품을 찾을 수 없습니다.");
    }
    return updatedProduct;
  } catch (err) {
    console.error("Error while updating product:", err);
    throw new Error("제품을 업데이트하는 중 오류가 발생했습니다. 상품 카테고리 및 브랜드 카테고리를 확인해주세요.");
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
    console.error("Error while deleting product:", err);
    throw new Error("제품을 삭제하는 중 오류가 발생했습니다.");
  }
};

export default {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};