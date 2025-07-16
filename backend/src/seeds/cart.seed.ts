import mongoose from "mongoose";
import Cart from "../models/cart.model";

export const seedCarts = async () => {
    await Cart.insertMany([
        {
            userId: new mongoose.Types.ObjectId("686d234a79757598e48d6796"), // phone:7559027982, login with otp 
            items: [
                {
                    productId: new mongoose.Types.ObjectId("6873bc3a52a84da1d4df39f3"),
                    quantity: 1
                },
                {
                    productId: new mongoose.Types.ObjectId("6873bc3a52a84da1d4df39f6"),
                    quantity: 2
                }
            ],
            updatedAt: new Date()
        }
    ]);

    console.log("Carts seeded.");
};
