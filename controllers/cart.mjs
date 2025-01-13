import Cart from "../models/cart.mjs";

const getCart = async (req, res) => {
  try {
    // Get cart data from request body
    const cartData = req.body.cart;

    // If no cart exists yet
    if (!cartData) {
      return res.status(200).json({
        success: true,
        message: "No cart exists",
        cart: { items: [], totalPrice: 0 },
      });
    }

    // If cart exists
    res.status(200).json({
      success: true,
      message: "Cart retrieved successfully",
      cart: cartData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving cart",
      error: error.message,
    });
  }
};

export default { getCart };
