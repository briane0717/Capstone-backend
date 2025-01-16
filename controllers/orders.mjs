import Orders from "../models/orders.mjs";
import Product from "../models/product.mjs";

const getOrders = async (req, res) => {
  try {
    const { userId, email } = req.query;

    let orders;
    if (userId) {
      orders = await Orders.find({ userId });
    } else if (email) {
      orders = await Orders.find({
        "customerInfo.contactDetails.email": email,
      });
    } else {
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

    const order = await Orders.findById(orderId);

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

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { userId, email } = req.query;

    const order = await Orders.findById(orderId);

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
    const order = await Orders.findById(orderId);

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
    for (const item of order.orderItems) {
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
const createOrder = async (req, res) => {
  try {
    const { userId, customerInfo, orderItems, paymentInfo, shippingDetails } =
      req.body;

    // Validate required fields
    if (!customerInfo || !orderItems || !paymentInfo || !shippingDetails) {
      return res.status(400).json({
        message:
          "Missing required fields: customerInfo, orderItems, paymentInfo, or shippingDetails",
      });
    }

    // Validate customerInfo
    const { name, contactDetails, shippingAddress } = customerInfo;
    if (!name || !contactDetails || !contactDetails.email || !shippingAddress) {
      return res.status(400).json({
        message:
          "Incomplete customer information. Name, email, and shipping address are required.",
      });
    }

    // Validate shippingAddress
    const { street, city, state, postalCode, country } = shippingAddress;
    if (!street || !city || !state || !postalCode || !country) {
      return res.status(400).json({
        message:
          "Incomplete shipping address. Street, city, state, postal code, and country are required.",
      });
    }

    // Validate shippingDetails
    const { method, cost, estimatedDeliveryDate } = shippingDetails;
    if (
      !method ||
      typeof cost !== "number" ||
      cost < 0 ||
      !estimatedDeliveryDate
    ) {
      return res.status(400).json({
        message:
          "Invalid shipping details. Method, cost, and estimated delivery date are required.",
      });
    }

    // Validate paymentInfo
    const { method: paymentMethod, orderTotal } = paymentInfo;
    if (!paymentMethod || typeof orderTotal !== "number" || orderTotal < 0) {
      return res.status(400).json({
        message:
          "Invalid payment information. Payment method and total amount are required.",
      });
    }

    // Validate orderItems
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: "Order items are required." });
    }

    let totalPrice = cost;

    // Check product availability, update stock, and calculate total price
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with ID ${item.product} not found.` });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product ${product.name}.`,
        });
      }

      // Deduct stock
      product.quantity -= item.quantity;
      await product.save();

      // Calculate total price for the order
      totalPrice += item.priceAtPurchase * item.quantity;
    }

    // Ensure the payment total matches calculated total price
    if (Math.abs(totalPrice - orderTotal) > 0.01) {
      return res.status(400).json({
        message:
          "Payment total does not match the calculated total price, including shipping cost.",
      });
    }

    // Create new order
    const newOrder = new Orders({
      userId: userId || null, // Allow null for guest orders
      customerInfo,
      orderItems,
      paymentInfo: {
        ...paymentInfo,
        orderTotal: totalPrice,
      },
      shippingDetails,
      orderStatus: "Pending",
      lastUpdated: Date.now(),
    });

    // Save order to database
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getOrders,
  getOrderById,
  getOrderStatus,
  cancelOrder,
  createOrder,
};
