import Order from "../models/order.mjs";
import Product from "../models/product.mjs";

const getOrders = async (req, res) => {
  try {
    // Check for userId (registered user) or email (guest)
    const { userId, email } = req.query;

    let orders;
    if (userId) {
      // Find orders for registered user
      orders = await Order.find({ userId });
    } else if (email) {
      // Find orders for guest user
      orders = await Order.find({ "customerInfo.contactDetails.email": email });
    } else {
      // No identification provided
      return res.status(400).json({ message: "User ID or email is required" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { userId, email } = req.query;

    // Find the specific order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify order belongs to user
    if (userId && order.userId != userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }
    // Verify order belongs to guest
    if (email && order.customerInfo.contactDetails.email !== email) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { userId, email } = req.query;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify order belongs to user
    if (userId && order.userId != userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }

    if (email && order.customerInfo.contactDetails.email !== email) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }

    // Return just the status info
    res.status(200).json({
      status: order.orderStatus,
      lastUpdated: order.lastUpdated,
      estimatedDelivery: order.estimatedDelivery,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { userId, email } = req.query;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (userId && order.userId != userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }

    if (email && order.customerInfo.contactDetails.email !== email) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }
    if (order.orderStatus === "Shipped" || order.orderStatus === "Delivered") {
      return res.status(400).json({
        message: "Cannot cancel order that has been shipped or delivered",
      });
    }
    for (const item of order.order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantity += item.quantity;
        await product.save();
      }
    }

    order.orderStatus = "Cancelled";
    order.lastUpdated = Date.now();
    await order.save();
    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export default { getOrders, getOrderById, getOrderStatus, cancelOrder };
