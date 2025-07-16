import mongoose from "mongoose";
import Category from "../models/category.model";

export const seedCategories = async () => {
    await Category.insertMany([
        {
            _id: new mongoose.Types.ObjectId("64d1c7a0a78b4f85f4e4b2a1"),
            name: "Electronics"
        },
        {
            _id: new mongoose.Types.ObjectId("64d1c7a0a78b4f85f4e4b2a2"),
            name: "Mobiles",
            parentId: new mongoose.Types.ObjectId("64d1c7a0a78b4f85f4e4b2a1")
        },
        {
            _id: new mongoose.Types.ObjectId("64d1c7a0a78b4f85f4e4b2a3"),
            name: "Laptops",
            parentId: new mongoose.Types.ObjectId("64d1c7a0a78b4f85f4e4b2a1")
        },
        {
            _id: new mongoose.Types.ObjectId("64d1c7a0a78b4f85f4e4b2a4"),
            name: "Home Appliances"
        },
        {
            _id: new mongoose.Types.ObjectId("64d1c7a0a78b4f85f4e4b2a5"),
            name: "Refrigerators",
            parentId: new mongoose.Types.ObjectId("64d1c7a0a78b4f85f4e4b2a4")
        }
    ]);
};
