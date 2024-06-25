import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/schema/product.js';
import Brand from '../models/schema/brand.js';
import Category from '../models/schema/category.js';
import Variant from '../models/schema/variant.js'; // Variant 모델 추가

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('brand').populate('category');
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: '서버 오류로 인해 제품을 가져올 수 없습니다.' });
    }
});

router.get('/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId).populate('brand').populate('category');
        if (!product) {
            return res.status(404).json({ message: '제품을 찾을 수 없습니다.' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: '서버 오류로 인해 제품을 가져올 수 없습니다.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, brand, category, description, longdescription, price, images } = req.body;
        
        // 브랜드와 카테고리가 유효한지 확인
        const brandExists = await Brand.findById(brand); // FB: 제외
        const categoryExists = await Category.findById(category);

        const product = new Product({
            name,
            brand,
            category,
            description,
            longdescription,
            price,
            images
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const updates = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(productId, updates, { new: true }).populate('brand').populate('category');
        if (!updatedProduct) {
            return res.status(404).json({ message: '제품을 찾을 수 없습니다.' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: '서버 오류로 인해 제품을 업데이트할 수 없습니다.' });
    }
});

router.delete('/:productId', async (req, res) => {

    try {
        const { productId } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: '제품을 찾을 수 없습니다.' });
        }
        await Variant.deleteMany({ productId: deletedProduct._id });

        res.status(200).json({ message: '제품이 성공적으로 삭제되었습니다.' }); // FB: status code 204
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: '서버 오류로 인해 제품을 삭제할 수 없습니다.' });
    }
});

export default router;
