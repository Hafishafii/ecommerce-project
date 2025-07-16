import { Request, Response } from "express";
import Product from "../models/product.model";

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
