import express from "express";
import Brand from "../models/schema/brand.js";
import Product from "../models/schema/product.js";
import Category from "../models/schema/category.js"; // 왜 이게 필요하지? ㅠㅠ
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const brands = await Brand.find();
        res.status(200).json(brands);
    } catch (error) {
        console.error('Error fetching brands:', error);
        res.status(500).json({ message: '서버 오류로 인해 브랜드를 가져올 수 없습니다.' });
    }
});
   
router.get("/:brandId", async (req, res) => {
    try {
        const products = await Product.find({ brand:req.params.brandId }).populate('brand').populate('category');
        res.json(products);
    } catch (error) {
        console.error('Error fetching products for brand:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: '브랜드 이름이 필요합니다.' });
    }
    try {
        const newBrand = new Brand({ name });
        await newBrand.save();
        res.status(201).json(newBrand);
    } catch (error) {
        console.error('Error adding brand:', error);
        res.status(500).json({ message: '서버 오류로 인해 브랜드를 추가할 수 없습니다.' });
    }
});   

router.put('/:brandId', async (req, res) => {
    const { brandId } = req.params;
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: '브랜드 이름이 필요합니다.' });
    }
    try {
        const updatedBrand = await Brand.findByIdAndUpdate(
        brandId,
        { name },
        { new: true, runValidators: true }
    );
        if (!updatedBrand) {
            return res.status(404).json({ message: '브랜드를 찾을 수 없습니다.' });
        }
        res.status(200).json(updatedBrand);
    } catch (error) {
        console.error('Error updating brand:', error);
        res.status(500).json({ message: '서버 오류로 인해 브랜드를 수정할 수 없습니다.' });
    }
 });

router.delete('/:brandId', async (req, res) => {
    const { brandId } = req.params;
    try {
        const products = await Product.find({ brand: brandId });
        console.log(`Products linked to brand ${brandId}:`, products);
    if (products.length > 0) {
        return res.status(400).json({ message: '이 브랜드와 연결된 제품이 있으므로 삭제할 수 없습니다.' });
    }
    const deletedBrand = await Brand.findByIdAndDelete(brandId);
    if (!deletedBrand) {
        return res.status(404).json({ message: '브랜드를 찾을 수 없습니다.' });
    }
    res.status(200).json({ message: '브랜드가 성공적으로 삭제되었습니다.' });} 
    catch (error) {
        console.error('Error deleting brand:', error);
        res.status(500).json({ message: '서버 오류로 인해 브랜드를 삭제할 수 없습니다.' });
    }
});

export default router;