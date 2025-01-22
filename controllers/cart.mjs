import Cart from "../models/cart.mjs";
import Product from "../models/product.mjs";

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne().populate("items.productId");

    if (!cart) {
      return res.status(200).json({ items: [], totalPrice: 0 });
    }

    // Remove items with null productId (deleted products)
    cart.items = cart.items.filter((item) => item.productId);

    // Recalculate total price
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();
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
        (item) => item.productId?.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity, price: product.price });
      }

      // Recalculate total after filtering null products
      cart.items = cart.items.filter((item) => item.productId);
      cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
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
    let cart = await Cart.findOne();
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove items with null productId first
    cart.items = cart.items.filter((item) => item.productId);

    const itemIndex = cart.items.findIndex(
      (item) => item.productId?.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

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
    let cart = await Cart.findOne();
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId?._id?.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items.splice(itemIndex, 1);
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();
    const updatedCart = await cart.populate("items.productId");
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error removing item:", error);
    res.status(500).json({ message: error.message });
  }
};
const handleRemoveItem = async (productId) => {
  try {
    const response = await axios.delete(
      `http://localhost:5050/api/cart/remove/${productId}`
    );
    setCart(response.data);
    setError(null);
  } catch (err) {
    console.error("Error details:", err.response?.data);
    setError("Failed to remove item");
  }
};
const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne();
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();
    res.status(200).json({ message: "Cart cleared successfully", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { getCart, addToCart, updateCart, removeFromCart, clearCart };
