import { Request, Response, NextFunction} from "express";
import Product from "../models/product.model";
import mongoose from "mongoose";
import "../models/category.model";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const {
      category,
      brand,
      min = 0,
      max = 100000,
      sort = "price", // price | -price | createdAt | -createdAt
      page = 1,
      limit = 12,
    } = req.query;

    const filters: any = {
      price: { $gte: Number(min), $lte: Number(max) },
    };

    if (category) filters.category = category;
    if (brand) filters.brand = brand;

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filters)
      .sort(sort as string)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filters);

    res.status(200).json({ total, page: Number(page), products });
  } catch (error) {
    console.error("❌ Failed to fetch products:", error);
    res.status(500).json({ message: "Failed to fetch products." });
  }
};



export const getProductById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      console.log("Product ID:", id);
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("❌ Invalid ObjectId");
        return res.status(400).json({ message: "Invalid product ID" });
      }
  
      const product = await Product.findById(id)
        .populate("category") 
        .lean();
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.status(200).json({ product });
    } catch (error: any) {
      console.error("❌ Error fetching product by ID:", error.message, error.stack);
      res.status(500).json({ message: error.message || "Server error while fetching product" });
    }
  };
  




  export const getProductViaToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      res.status(400).json({ message: "Invalid request." });
      return;
    }

    let productsData;

    try {
      productsData = JSON.parse(token);

      if (!Array.isArray(productsData) || productsData.length === 0) {
        throw new Error();
      }

      const isInvalid = productsData.some((product) => {
        const invalidProductId = !mongoose.isValidObjectId(product?.productId);
        const invalidVariantId =
          product?.variantId && !mongoose.isValidObjectId(product.variantId);
        const invalidQuantity =
          typeof product?.quantity !== "number" || product.quantity <= 0;

        return invalidProductId || invalidVariantId || invalidQuantity;
      });

      if (isInvalid) {
        throw new Error();
      }
    } catch {
      res.status(400).json({ message: "Invalid request format." });
      return;
    }

    const outOfStockItems: string[] = [];

    let totalOriginalPrice = 0;
    let totalOfferPrice = 0;

    const validatedItems = await Promise.all(
      productsData.map(async (item) => {
        const product = await Product.findById(item.productId).select(
          "name images price discount stock variants"
        );

        if (!product) return null;

        let stock = product.stock;
        let selectedVariant = null;
        let resolvedPrice = product.price;

        if (item?.variantId) {
          selectedVariant = product.variants?.find(
            (v) => v?._id?.toString() === item.variantId
          );
          stock = selectedVariant?.stock ?? 0;
          resolvedPrice = selectedVariant?.price ?? product.price;
        }

        if (stock < item.quantity) {
          outOfStockItems.push(
            `${product.name}${selectedVariant ? ` (${selectedVariant.name})` : ""}`
          );
        }

        // ✅ Corrected: move price calculations **outside** the if block
        const discountPercentage = product.discount?.percentage || 0;
        const originalPrice = resolvedPrice * item.quantity;
        const offerPrice =
          resolvedPrice *
          ((100 - discountPercentage) / 100) *
          item.quantity;
        const discountAmount = originalPrice - offerPrice;

        totalOriginalPrice += originalPrice;
        totalOfferPrice += offerPrice;

        return {
          product: {
            _id: product._id,
            name: product.name,
            images: product.images,
            stock,
          },
          ...(selectedVariant && {
            variant: {
              _id: selectedVariant._id,
              name: selectedVariant.name,
              size: selectedVariant.size,
              sku: selectedVariant.sku,
              stock: selectedVariant.stock,
              images: selectedVariant.images,
            },
          }),
          quantity: item.quantity,
          originalPrice,
          offerPrice,
          discountAmount,
        };
      })
    );

    if (outOfStockItems.length > 0) {
      res.status(400).json({
        message: "OUT_OF_STOCK",
        outOfStock: outOfStockItems,
      });
      return;
    }

    const filtered = validatedItems.filter((item) => item !== null);

    const totalDiscount = totalOriginalPrice - totalOfferPrice;
    const deliveryCharge = totalOfferPrice < 999 ? 50 : 0;
    const finalAmount = totalOfferPrice + deliveryCharge;

    res.status(200).json({
      products: filtered,
      summary: {
        totalOriginalPrice,
        totalOfferPrice,
        totalDiscount,
        deliveryCharge,
        finalAmount,
      },
    });
  } catch (error) {
    console.log("Error in getProductViaToken:", error);
    next(error);
  }
};