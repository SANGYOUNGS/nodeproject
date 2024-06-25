import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/schema/product.js';
import Brand from '../models/schema/brand.js';
import Category from '../models/schema/category.js';
import Variant from '../models/schema/variant.js';

const router = express.Router();

// PATH: /api/products/:productId/variants/:variantId // FB: API를 이렇게 구성하면 좋을듯

// 특정 product에 소속된 모든 variant들 가져오기
router.get('/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const variants = await Variant.find({ productId });
        res.json(variants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 특정 product에 소속된 하나의 variant 정보 가져오기
router.get('/:productId/variants/:variantId', async (req, res) => {
    try {
        const { productId, variantId } = req.params;
        const variant = await Variant.findOne({ _id: variantId, productId });
        if (!variant) return res.status(404).json({ message: 'Variant not found' });
        res.json(variant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 새로운 variant 생성
router.post('/', async (req, res) => {
    try {
        const { color, sizes, productId } = req.body;
        const newVariant = new Variant({ color, sizes, productId });
        const savedVariant = await newVariant.save();
        res.status(201).json(savedVariant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 기존 variant 수정
router.put('/:variantId', async (req, res) => {
    try {
        const { variantId } = req.params;
        const { color, sizes } = req.body;
        const updatedVariant = await Variant.findByIdAndUpdate(
            variantId,
            { color, sizes },
            { new: true }
        );
        if (!updatedVariant) return res.status(404).json({ message: 'Variant not found' });
        res.json(updatedVariant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// variant 삭제
router.delete('/:variantId', async (req, res) => {
    try {
        const { variantId } = req.params;
        const deletedVariant = await Variant.findByIdAndDelete(variantId);
        if (!deletedVariant) return res.status(404).json({ message: 'Variant not found' });
        res.json({ message: 'Variant deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;