import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    // Store the user id when the cart is created for authenticated users
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      // when user model gets created, we will reference it here
      ref: "User",
      // Optional for now as it's not mandatory for guests
      required: false,
    },
    items: [
      {
        // Store the product id when the product is added to the cart
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        // Store quantity when the product is added to the cart
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        // Store price when the product is added to the cart
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    // Store the total price of all items in the cart
    totalPrice: {
      type: Number,
      default: 0,
    },
    // Set this whenever the cart is updated
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
