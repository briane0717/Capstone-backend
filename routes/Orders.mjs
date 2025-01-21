import express from "express";
import ordersController from "../controllers/orders.mjs";
const router = express.Router();

// Gets all orders
router.get("/", ordersController.getOrders);
// Gets an order by its id
router.get("/:id", ordersController.getOrderById);
//Check order status
router.get("/:id/status", ordersController.getOrderStatus);
//Cancel order
router.put("/:id/cancel", ordersController.cancelOrder);
// Create order. Will be moved later
router.post("/", ordersController.createOrder);

//Delete order
router.delete("/:id", ordersController.deleteOrder);

export default router;
