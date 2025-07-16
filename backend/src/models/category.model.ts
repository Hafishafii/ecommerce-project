import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  parentId?: mongoose.Types.ObjectId;
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
});

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category;
