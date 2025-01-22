# E-Commerce Backend

Node.js/Express backend for an e-commerce platform with MongoDB database.

## Features

- RESTful API
- Product management
- Cart operations
- Order processing
- MongoDB integration

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose

## Route Structure

### Product Routes

```javascript
router.get("/", productController.getProducts); // Gets all products
router.get("/:id", productController.getProductById); // Gets a product by its id
router.post("/", productController.createProduct); // Creates a product
router.delete("/:id", productController.deleteProduct); // Deletes a product
router.put("/:id", productController.updateProduct); // Updates a product
```

### Cart Routes

```javascript
router.get("/", cartController.getCart); // Gets cart
router.post("/add", cartController.addToCart); // Adds to cart
router.put("/update/:productId", cartController.updateCart); // Updates cart
router.delete("/remove/:productId", cartController.removeFromCart); // Removes from cart
router.delete("/clear", cartController.clearCart); // Clears cart
```

### Order Routes

```javascript
router.get("/", ordersController.getOrders); // Gets all orders
router.get("/:id", ordersController.getOrderById); // Gets order by id
router.get("/:id/status", ordersController.getOrderStatus); // Checks order status
router.put("/:id/cancel", ordersController.cancelOrder); // Cancels order
router.post("/", ordersController.createOrder); // Creates order
router.delete("/:id", ordersController.deleteOrder); // Deletes order
```

## Installation

1. Clone the repository

```bash
git clone [backend-repo-url]
cd backend
```

2. Install dependencies

```bash
npm install
```

3. Environment Setup

Create `.env`:

```
MONGODB_URI=your_mongodb_connection_string
PORT=5050

```

4. Start Server

```bash
npm start
```

## Project Structure

```
├── controllers/
├── models/
├── routes/
└── server.js
```

## Database Models

- Products: Product information and inventory
- Cart: Shopping cart data
- Orders: Order processing and tracking

## Future Enhancements

- User authentication
- Payment processing
- Advanced search
- Analytics
- Admin dashboard
