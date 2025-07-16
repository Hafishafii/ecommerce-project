import mongoose from "mongoose";
import Product from "../models/product.model";

export const seedProducts = async () => {
    await Product.insertMany([
        {
            name: "iPhone 15 Pro",
            description: "Latest Apple iPhone with A17 Bionic chip",
            brand: "Apple",
            categoryId: new mongoose.Types.ObjectId("64d1c7a0a78b4f85f4e4b2a2"),
            price: 129999,
            discount: {
                percentage: 5,
                expiresAt: new Date("2025-08-01")
            },
            stock: 50,
            sku: "APL-IP15P-256-BLK",
            barcode: "1234567890123",
            variants: [
                { name: "Storage", value: "256GB" },
                { name: "Color", value: "Black Titanium" }
            ],
            images: [
                "https://example.com/images/iphone15pro-front.jpg",
                "https://example.com/images/iphone15pro-back.jpg"
            ],
            tags: ["smartphone", "ios", "flagship"],
            averageRating: 4.7,
            totalReviews: 420,
            sellerId: {
                id: new mongoose.Types.ObjectId("64d1c7a0a78b4f85f4e4b2b3"), // Seller
                name: "TechStore"
            },
            dimensions: {
                weight: 221,
                height: 146.6,
                width: 70.6,
                depth: 8.3
            },
            createdAt: new Date()
        },
        {
            name: "Samsung Galaxy S24 Ultra",
            description: "Flagship Android phone with advanced AI features",
            brand: "Samsung",
            categoryId: new mongoose.Types.ObjectId("64d1c7a0a78b4f85f4e4b2a2"),
            price: 119999,
            discount: {
                percentage: 10,
                expiresAt: new Date("2025-09-01")
            },
            stock: 100,
            sku: "SMS-S24U-512-GRY",
            barcode: "2345678901234",
            variants: [
                { name: "Storage", value: "512GB" },
                { name: "Color", value: "Gray" }
            ],
            images: [
                "https://example.com/images/s24ultra-front.jpg",
                "https://example.com/images/s24ultra-back.jpg"
            ],
            tags: ["android", "samsung", "ultra"],
            averageRating: 4.5,
            totalReviews: 320,
            sellerId: {
                id: new mongoose.Types.ObjectId("64d1c7a0a78b4f85f4e4b2c5"),
                name: "GadgetHub"
            },
            dimensions: {
                weight: 234,
                height: 163.3,
                width: 78.1,
                depth: 8.9
            },
            createdAt: new Date()
        }
    ]);

    console.log("Products seeded.");
};
