import { NextFunction, Request, Response } from "express";
import Cart from "../models/cart.model";
import Product from "../models/product.model";
import mongoose from "mongoose";

// Get Carts all carts of a user
export const getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const carts = await Cart.find({ userId }).populate({
            path: 'items.productId',
            select: 'name images averageRating price'
        });

        res.status(200).json({ carts: carts?.length > 0 ? carts[0]?.items : [] });
    } catch (error) {
        console.log("Error in getting carts :", error)
        next(error)
    }
}

// Add a new product to cart
export const addToCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { productId } = req.body;
        const quantity = 1

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            res.status(400).json({ message: "Invalid productId" });
            return
        }

        const productExists = await Product.findById(productId);
        if (!productExists) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = await Cart.create({
                userId,
                items: [{ productId, quantity }]
            });
        } else {
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }
            cart.updatedAt = new Date();
            await cart.save();
        }

        res.status(200).json({ message: "Item added to cart", cart });
    } catch (error) {
        console.log("Error in addToCart:", error);
        next(error);
    }
}

// Remove product from the cart
export const removeFromCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { productId } = req.params;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        cart.updatedAt = new Date();
        await cart.save();

        res.status(200).json({ message: "Item removed from cart", cart });
    } catch (error) {
        console.log("Error in removeFromCart:", error);
        next(error);
    }
}

// Update cart quantity
export const updateCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { productId, quantity } = req.body;

        if (!quantity || typeof quantity !== 'number' || quantity < 1) {
            res.status(400).json({ message: "Quantity must be at least 1" });
            return;
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }

        const item = cart.items.find(item => item.productId.toString() === productId);
        if (!item) {
            res.status(404).json({ message: "Item not found in cart" });
            return;
        }

        item.quantity = quantity;
        cart.updatedAt = new Date();
        await cart.save();

        res.status(200).json({ message: "Cart updated", cart });
    } catch (error) {
        console.log("Error in updateCart:", error);
        next(error);
    }
}