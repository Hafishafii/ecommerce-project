import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  variant?: mongoose.Types.ObjectId;
  price: number;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddressId: mongoose.Types.ObjectId;
  orderedAt: Date;

  paymentMethod: 'Razorpay' | 'COD' | 'Card';
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  paymentId?: string;
  razorpayOrderId?: string;
  transactionId?: string;
  paidAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
}

const orderSchema = new Schema<IOrder>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      variant: { type: Schema.Types.ObjectId },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', "Placed", 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
    required: true,
  },
  shippingAddressId: {
    type: Schema.Types.ObjectId,
    ref: 'Address',
    required: true,
  },
  orderedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },

  paymentMethod: {
    type: String,
    enum: ['Razorpay', 'COD'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Failed'],
    default: 'Pending',
    required: true,
  },
  paymentId: String,
  razorpayOrderId: String,
  paidAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
});

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;