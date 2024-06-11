import mongoose from 'mongoose';
const { Schema } = mongoose;

const sizeSchema = new Schema({
  size: { type: String, required: true },
  quantity: { type: Number, required: true }
});

const variantSchema = new Schema({
  color: { type: String, required: true },
  sizes: [sizeSchema],
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
});

const Variant = mongoose.model('Variant', variantSchema);
export default Variant;