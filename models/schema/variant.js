import mongoose from 'mongoose';
const { Schema } = mongoose;

const variantSchema = new Schema({
  color: { type: String, required: true },
  sizes: {
    XS: { type: Number, default: 0 },
    S: { type: Number, default: 0 },
    M: { type: Number, default: 0 },
    L: { type: Number, default: 0 },
    XL: { type: Number, default: 0 }
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
});

const Variant = mongoose.model('Variant', variantSchema);
export default Variant;