import express from "express";
import cartController from "../controllers/cart.mjs";
const router = express.Router();

router.get("/", cartController.getCart);
// router.post("/add", cartController.addToCart);
// router.put("/update/:id", cartController.updateCartItem);
// router.delete("/remove/:id", cartController.removeFromCart);
// router.delete("/clear", cartController.clearCart);

export default router;
