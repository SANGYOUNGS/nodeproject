import express from "express";
import Brand from "../models/schema/brand.js";
import Product from "../models/schema/product.js";
import Category from "../models/schema/category.js"; // 왜 이게 필요하지? ㅠㅠ
const router = express.Router();

router.get('/', async (req, res) => {
    try {
    const categories = await Category.find();
    res.status(200).json(categories);
    } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: '서버 오류로 인해 카테고리를 가져올 수 없습니다.' });
    }
});

router.get("/:categoryId", async (req, res) => {
    try {
        const products = await Product.find({ category:req.params.categoryId }).populate('brand').populate('category');
        res.json(products);
    } catch (error) {
        console.error('Error fetching products for category:', error);
        res.status(500).json({ error: error.message });
    }
})

router.post('/', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: '카테고리 이름이 필요합니다.' });
    }
    try {
        const newCategory = new Category({ name });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ message: '서버 오류로 인해 카테고리를 추가할 수 없습니다.' });
    }
});

router.put('/:categoryId', async (req, res) => {
    const { categoryId } = req.params;
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: '카테고리 이름이 필요합니다.' });
    }
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { name },
            { new: true, runValidators: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ message: '카테고리를 찾을 수 없습니다.' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: '서버 오류로 인해 카테고리를 수정할 수 없습니다.' });
    }
});

router.delete('/:categoryId', async (req, res) => {
    const { categoryId } = req.params;
    try {
        const products = await Product.find({ category: categoryId });
        console.log(`Products linked to category ${categoryId}:`, products); // FB: 불필요한 console.log 삭제
        if (products.length > 0) {
            return res.status(400).json({ message: '이 카테고리와 연결된 제품이 있으므로 삭제할 수 없습니다.' });
        }
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res.status(404).json({ message: '카테고리를 찾을 수 없습니다.' });
        }
        res.status(200).json({ message: '카테고리가 성공적으로 삭제되었습니다.' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: '서버 오류로 인해 카테고리를 삭제할 수 없습니다.' });
    }
});

export default router;