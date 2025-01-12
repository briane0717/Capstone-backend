import Product from "../models/product.mjs";

const seed = async (req, res) => {
  try {
    // You can clear the existing data if you want to reset the products every time you seed
    // await Product.deleteMany({});

    // Seed new products
    await Product.create([
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

    // Send success response
    res.status(201).json({ message: "Products seeded successfully" });
  } catch (err) {
    // If error occurs, send it to the client
    res.status(400).send(err);
  }
};

const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 10;
    const skip = (page - 1) * limit;

    console.log("GET request received at /api/product");
    const products = await Product.find().skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments();
    console.log(totalProducts);
    console.log("Fetched products:", products);
    const totalPages = Math.ceil(totalProducts / limit);
    console.log(totalPages);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    console.log("Requested ID:", req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export default { seed, getProducts, getProductById };
