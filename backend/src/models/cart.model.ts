import { Schema, model, Document, Types } from "mongoose";

interface CartItem {
  product: Types.ObjectId;
  variant?: Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  userId: Types.ObjectId;
  items: CartItem[];
  updatedAt: Date;
}

const cartItemSchema = new Schema<CartItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  variant: { type: Schema.Types.ObjectId },
  quantity: { type: Number, default: 1 },
});

const cartSchema = new Schema<ICart>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [cartItemSchema],
  updatedAt: { type: Date, default: Date.now },
});

const Cart = model<ICart>("Cart", cartSchema);

export default Cart;