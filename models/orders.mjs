import mongoose from "mongoose";

const ordersSchema = new mongoose.Schema(
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
          // Retrieves the products associated with this order
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
ordersSchema.index({ "customerInfo.contactDetails.email": 1 });
ordersSchema.index({ orderStatus: 1 });
ordersSchema.index({ createdAt: -1 });

export default mongoose.model("Orders", ordersSchema);
