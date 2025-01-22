# Capstone-backend

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

## API Endpoints

### Products

- GET `/api/products` - Get all products with pagination and filters
- GET `/api/products/:id` - Get single product
- POST `/api/products` - Create product
- PUT `/api/products/:id` - Update product
- DELETE `/api/products/:id` - Delete product

### Cart

- GET `/api/cart` - Get cart contents
- POST `/api/cart/add` - Add item to cart
- PUT `/api/cart/update/:productId` - Update item quantity
- DELETE `/api/cart/remove/:productId` - Remove item
- DELETE `/api/cart/clear` - Clear cart

### Orders

- GET `/api/orders` - Get all orders (with email filter)
- GET `/api/orders/:id` - Get single order
- POST `/api/orders` - Create order
- PUT `/api/orders/:id/cancel` - Cancel order
- GET `/api/orders/:id/status` - Check order status

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
CORS_ORIGIN=http://localhost:3000
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
