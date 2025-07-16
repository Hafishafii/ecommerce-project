import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware";
import { authRoute, cartRoute } from "./routes";
import { connectDB } from "./config/db";
import { seedCarts } from "./seeds/cart.seed";
import { seedCategories } from "./seeds/category.seeds";
import { seedProducts } from "./seeds/product.seed";
import cookieParser from 'cookie-parser';
import mongoose from "mongoose";
import productRoutes from "./routes/product.routes";


const app = express();
const PORT = process.env.PORT || 3000;

// Connect Database
connectDB();

// const runSeed = async () => {
//   await connectDB();
//   await seedCategories();
//   await seedProducts();
//   await seedCarts();
// };

// runSeed()

// Middlewares
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], // For dev only
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root 
app.get("/", async (_req, res) => {
  res.send("Hai there, API is running...");
});

// Routes
app.use('/api/auth', authRoute)
app.use('/api/cart', cartRoute)
app.use("/api/products", productRoutes);

// Error handler
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.use((req, res, next) => {
  console.log(`[ROUTE] ${req.method} ${req.url}`);
  next();
});