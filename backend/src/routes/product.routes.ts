import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  getProductViaToken,
} from "../controllers/product.controller";

const router = Router();

// ✅ ORDER MATTERS: place this before `/:id`
router.get("/order-details", getProductViaToken);

// Catch-all product by ID
router.get("/:id", getProductById);

// All products
router.get("/", getAllProducts);

export default router;
