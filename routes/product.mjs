// ** imports
import express from "express";
const router = express.Router();
import productController from "../controllers/product.mjs";

router.get("/", productController.getProducts);
router.post("/seed", productController.seed);

export default router;
