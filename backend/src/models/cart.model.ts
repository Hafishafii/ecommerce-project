import mongoose, { Document, Schema } from 'mongoose';
import './product.model'

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  updatedAt: Date;
}

const cartSchema = new Schema<ICart>({
  userId: {
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
  },
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        required: true,
      },
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Cart = mongoose.model<ICart>('Cart', cartSchema);

export default Cart;
