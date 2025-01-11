import product from "../models/product.mjs";

async function seed(req, res) {
  try {
    await product.create([
      {
        name: "Product 1",
        price: 10,
        description: "This is product 1",
        image: "image1.jpg",
        category: "Category 1",
        quantity: 10,
      },
      {
        name: "Product 2",
        price: 20,
        description: "This is product 2",
        image: "image2.jpg",
        category: "Category 2",
        quantity: 5,
      },
      {
        name: "Product 3",
        price: 30,
        description: "This is product 3",
        image: "image3.jpg",
        category: "Category 1",
        quantity: 8,
      },
      {
        name: "Product 4",
        price: 40,
        description: "This is product 4",
        image: "image4.jpg",
        category: "Category 2",
        quantity: 3,
      },
    ]);
    res.status(201).send("Database updated");
  } catch (err) {
    res.status(400).send(err);
  }
}
const getProducts = async (req, res) => {
  try {
    console.log("GET request received at /api/product");
    const products = await product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export default { seed, getProducts, getProductById };
