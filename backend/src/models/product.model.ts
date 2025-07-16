import { Schema, model, Document, Types } from "mongoose";

interface Variant {
  _id?: Types.ObjectId;
  name?: string;
  size?: string;
  sku?: string;
  price?: number;
  stock?: number;
  images?: string[];
}

export interface IProduct extends Document {
  name: string;
  description?: string;
  brand?: string;
  category: Types.ObjectId;

  price: number;
  discount: {
    percentage: number;
    expiresAt?: Date;
  };

  stock: number;
  sku?: string;
  barcode?: string;

  variants: Variant[];

  images: string[];
  tags: string[];

  averageRating: number;
  totalReviews: number;

  dimensions?: {
    weight?: number;
    height?: number;
    width?: number;
    depth?: number;
  };

  createdAt: Date;
}

const variantSchema = new Schema<Variant>(
  {
    name: String,
    size: String,
    sku: { type: String, unique: true, sparse: true },
    price: Number,
    stock: { type: Number, default: 0 },
    images: [String],
  },
  { _id: true }
);

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: String,
  brand: String,
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },

  price: { type: Number, required: true },
  discount: {
    percentage: { type: Number, default: 0 },
    expiresAt: Date,
  },

  stock: { type: Number, default: 0 },
  sku: { type: String, unique: true, sparse: true },
  barcode: String,

  variants: [variantSchema],

  images: [String],
  tags: [String],

  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },

  dimensions: {
    weight: Number,
    height: Number,
    width: Number,
    depth: Number,
  },

  createdAt: { type: Date, default: Date.now },
});

const Product = model<IProduct>("Product", productSchema);

export default Product;