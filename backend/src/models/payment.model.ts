import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  orderId: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod: 'Card' | 'UPI' | 'COD';
  status: 'Pending' | 'Completed' | 'Failed';
  paymentDate: Date;
}

const paymentSchema = new Schema<IPayment>({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Card', 'UPI', 'COD'],
    default: 'COD',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending',
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
export default Payment;
