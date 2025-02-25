import express from "express";
import dotenv from "dotenv";
import logger from "morgan";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// import conn.mjs so that i connect to my db
import connectDB from "./db/conn.mjs";
//import cors so that my frontend and back end can communicate
import cors from "cors";

// import my routes from their folders
import cart from "./routes/cart.mjs";
import orders from "./routes/orders.mjs";
// import user from "./routes/user.mjs";
import product from "./routes/product.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// set up port
const PORT = process.env.PORT || 5050;

//create app
const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// middleware
app.use(cors());
// app.use(logger("dev"));
app.use(express.json());

//routes
app.get("/", (req, res) => {
  res.send(
    "<h1>Welcome to Gifted API</h1><ol>endpoints: <br/><li> Cart - /api/cart</li><li> Orders - /api/orders</li> <li> Product - /api/product</li><li> User - /api/user</li> <ol>"
  );
});

// fill in my endpoint routes - but they will be in their own folders
app.use("/api/cart", cart);
app.use("/api/orders", orders);
app.use("/api/products", product);
// app.use("/api/user", user);

// default, catch-all route
app.get("/*", (req, res) => {
  res.redirect("/");
});

//Golbal errror handling
app.use((err, _req, res, next) => {
  res.status(500).send("there was an issue on the server");
});

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
