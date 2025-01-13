import express from "express";
const router = express.Router();
import productController from "../controllers/product.mjs";

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.post("/", productController.createProduct);

export default router;
