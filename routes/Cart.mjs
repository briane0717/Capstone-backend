import express from "express";
import cartController from "../controllers/cart.mjs";
const router = express.Router();

router.get("/", cartController.getCart);
router.post("/add", cartController.addToCart);
router.put("/update/:productId", cartController.updateCart);
router.delete("/remove/:productId", cartController.removeFromCart);
router.delete("/clear", cartController.clearCart);

export default router;
