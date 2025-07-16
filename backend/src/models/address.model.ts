import mongoose, { Document, Schema } from 'mongoose';

export interface IAddress extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'Shipping' | 'Billing';
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

const addressSchema = new Schema<IAddress>({
  userId: {
    type: Schema.Types.ObjectId, // ✅ Correct usage
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['Shipping', 'Billing'],
    required: true,
  },
  line1: {
    type: String,
    required: true,
  },
  line2: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Address = mongoose.model<IAddress>('Address', addressSchema);

export default Address;
