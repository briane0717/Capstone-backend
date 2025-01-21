import Cart from "../models/cart.mjs";
import Product from "../models/product.mjs";

// Function to calculate the total price of all items in the cart
const calculateTotalPrice = (items) => {
  return items
    .reduce((total, item) => total + item.price * item.quantity, 0) // Sum price * quantity for each item
    .toFixed(2); // Return total price rounded to 2 decimal places
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne().populate("items.productId");
    if (!cart) {
      return res.status(200).json({ items: [], totalPrice: 0 });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity < 1) {
    return res.status(400).json({ message: "Invalid product or quantity" });
  }

  try {
    // Get product to check availability and price
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne();
    if (!cart) {
      cart = new Cart({
        items: [{ productId, quantity, price: product.price }],
        totalPrice: product.price * quantity,
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity, price: product.price });
      }

      // Recalculate total using the calculateTotalPrice function
      cart.totalPrice = calculateTotalPrice(cart.items);
    }

    await cart.save();
    const populatedCart = await cart.populate("items.productId");
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCart = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity < 0) {
    return res.status(400).json({ message: "Invalid product or quantity" });
  }

  try {
    const cart = await Cart.findOne();
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    // Recalculate total using the calculateTotalPrice function
    cart.totalPrice = calculateTotalPrice(cart.items);

    await cart.save();
    const updatedCart = await cart.populate("items.productId");
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne();
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items.splice(itemIndex, 1);
    // Recalculate total using calculateTotalPrice function
    cart.totalPrice = calculateTotalPrice(cart.items);

    await cart.save();
    const updatedCart = await cart.populate("items.productId");
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearCart = async (req, res) => {
  const { userId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Clear the cart
    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();
    res.status(200).json({ message: "Cart cleared successfully", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { getCart, addToCart, updateCart, removeFromCart, clearCart };
