import mongoose, { Schema, Document } from 'mongoose';

export interface Banner {
  image1: string;       // URL or path to the first image
  image2: string;       // URL or path to the second image
  image3: string;       // URL or path to the third image
  saleText: string;     // Text showing sale details
  categoryType?: mongoose.Types.ObjectId; // Optional category (e.g., "electronics", "clothing", etc.)
}

const bannerSchema = new Schema<Banner>({
  image1: { type: String, required: true },
  image2: { type: String, required: true },
  image3: { type: String, required: true },

  saleText: { type: String, required:true},

  categoryType:{
    type: Schema.Types.ObjectId,
    ref: 'Category',
  }

  
});

const Banner = mongoose.model<Banner>('Banner', bannerSchema);

export default Banner;