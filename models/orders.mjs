import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerInfo: {
      contactDetails: {
        email: {
          type: String,
          required: true,
          trim: true,
        },
        phone: {
          type: String,
          required: true,
          trim: true,
        },
      },
      shippingAddress: {
        street: {
          type: String,
          required: true,
          trim: true,
        },
        city: {
          type: String,
          required: true,
          trim: true,
        },
        state: {
          type: String,
          required: true,
          trim: true,
        },
        postalCode: {
          type: String,
          required: true,
          trim: true,
        },
        country: {
          type: String,
          required: true,
          trim: true,
        },
      },
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        priceAtPurchase: {
          type: Number,
          required: true,
          // Non-negative price
          min: 0,
        },
      },
    ],
    shippingDetails: {
      method: {
        type: String,
        required: true,
        trim: true,
      },
      cost: {
        // Non-negative cost
        type: Number,
        required: true,
        min: 0,
      },
      estimatedDeliveryDate: {
        type: Date,
        required: true,
      },
    },
    paymentInfo: {
      method: {
        type: String,
        required: true,
        trim: true,
      },
      orderTotal: {
        type: Number,
        required: true,
        // Non-negative total
        min: 0,
      },
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  // Automatically set the order creation date and update date
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
