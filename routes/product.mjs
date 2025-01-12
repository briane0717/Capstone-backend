// ** imports
import express from "express";
const router = express.Router();
import productController from "../controllers/product.mjs";
//get all products
router.get("/", productController.getProducts);
//gets individual product
router.get("/:id", productController.getProductById);
//seeds data to db
router.post("/seed", productController.seed);

export default router;
