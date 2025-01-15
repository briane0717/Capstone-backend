import express from "express";
const router = express.Router();
import productController from "../controllers/product.mjs";

//Gets all products
router.get("/", productController.getProducts);
//Gets a product by its id
router.get("/:id", productController.getProductById);
//Creates a product
// router.post("/", productController.createProduct);

export default router;
