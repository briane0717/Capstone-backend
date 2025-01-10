import express from "express";
import productController from "../controllers/product.mjs";

const router = express.Router();

// Debug middleware specific to products routes
router.use((req, res, next) => {
  console.log(`Products route accessed: ${req.method} ${req.url}`);
  next();
});

// Define the routes
router.get("/", async (req, res, next) => {
  console.log("Getting all products");
  try {
    await productController.getAllProducts(req, res);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  console.log("Creating new product");
  try {
    await productController.createProduct(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
