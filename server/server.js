const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Read the database file
const dbPath = path.join(__dirname, "db.json");
let database = JSON.parse(fs.readFileSync(dbPath, "utf8"));

// Helper function to save changes to the database file
const saveDatabase = () => {
  fs.writeFileSync(dbPath, JSON.stringify(database, null, 2), "utf8");
};

// Helper function to paginate results
const paginateResults = (data, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    total: data.length,
    page: parseInt(page),
    limit: parseInt(limit),
    hasMore: endIndex < data.length,
  };
};

// PRODUCT ENDPOINTS
// Get all products with optional filtering and pagination
app.get("/products", (req, res) => {
  const {
    category,
    minPrice,
    maxPrice,
    search,
    page = 1,
    limit = 10,
  } = req.query;
  let filteredProducts = [...database.products];

  if (category) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === category
    );
  }

  if (minPrice) {
    filteredProducts = filteredProducts.filter(
      (product) => product.price >= parseFloat(minPrice)
    );
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter(
      (product) => product.price <= parseFloat(maxPrice)
    );
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
    );
  }

  // Return paginated response
  res.json(paginateResults(filteredProducts, page, limit));
});

// Get a single product by ID
app.get("/products/:id", (req, res) => {
  const product = database.products.find((p) => p.id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({
      message: "Product not found",
      code: "PRODUCT_NOT_FOUND",
      status: 404,
    });
  }
});

// Create a new product
app.post("/products", (req, res) => {
  const newProduct = {
    ...req.body,
    id: `p${database.products.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  database.products.push(newProduct);
  saveDatabase();
  res.status(201).json(newProduct);
});

// Update an existing product
app.put("/products/:id", (req, res) => {
  const index = database.products.findIndex((p) => p.id === req.params.id);
  if (index !== -1) {
    database.products[index] = {
      ...database.products[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase();
    res.json(database.products[index]);
  } else {
    res.status(404).json({
      message: "Product not found",
      code: "PRODUCT_NOT_FOUND",
      status: 404,
    });
  }
});

// Delete a product
app.delete("/products/:id", (req, res) => {
  const index = database.products.findIndex((p) => p.id === req.params.id);
  if (index !== -1) {
    const deletedProduct = database.products[index];
    database.products.splice(index, 1);
    saveDatabase();
    res.json(deletedProduct);
  } else {
    res.status(404).json({
      message: "Product not found",
      code: "PRODUCT_NOT_FOUND",
      status: 404,
    });
  }
});

// Get products by category with pagination
app.get("/products/category/:category", (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const categoryProducts = database.products.filter(
    (p) => p.category === req.params.category
  );
  res.json(paginateResults(categoryProducts, page, limit));
});

// ORDER ENDPOINTS
// Get all orders with optional filtering and pagination
app.get("/orders", (req, res) => {
  const { status, userId, page = 1, limit = 10 } = req.query;
  let filteredOrders = [...database.orders];

  if (status) {
    filteredOrders = filteredOrders.filter((order) => order.status === status);
  }

  if (userId) {
    filteredOrders = filteredOrders.filter((order) => order.userId === userId);
  }

  res.json(paginateResults(filteredOrders, page, limit));
});

// Get a single order by ID
app.get("/orders/:id", (req, res) => {
  const order = database.orders.find((o) => o.id === req.params.id);
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({
      message: "Order not found",
      code: "ORDER_NOT_FOUND",
      status: 404,
    });
  }
});

// Create a new order
app.post("/orders", (req, res) => {
  const newOrder = {
    ...req.body,
    id: `o${database.orders.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  database.orders.push(newOrder);
  saveDatabase();
  res.status(201).json(newOrder);
});

// Update an existing order
app.put("/orders/:id", (req, res) => {
  const index = database.orders.findIndex((o) => o.id === req.params.id);
  if (index !== -1) {
    database.orders[index] = {
      ...database.orders[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase();
    res.json(database.orders[index]);
  } else {
    res.status(404).json({
      message: "Order not found",
      code: "ORDER_NOT_FOUND",
      status: 404,
    });
  }
});

// Delete an order
app.delete("/orders/:id", (req, res) => {
  const index = database.orders.findIndex((o) => o.id === req.params.id);
  if (index !== -1) {
    const deletedOrder = database.orders[index];
    database.orders.splice(index, 1);
    saveDatabase();
    res.json(deletedOrder);
  } else {
    res.status(404).json({
      message: "Order not found",
      code: "ORDER_NOT_FOUND",
      status: 404,
    });
  }
});

// Get orders for a specific user with pagination
app.get("/orders/user/:userId", (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const userOrders = database.orders.filter(
    (o) => o.userId === req.params.userId
  );
  res.json(paginateResults(userOrders, page, limit));
});

// USER ENDPOINTS
// Get all users with optional filtering and pagination
app.get("/users", (req, res) => {
  const { role, page = 1, limit = 10 } = req.query;
  let filteredUsers = [...database.users];

  if (role) {
    filteredUsers = filteredUsers.filter((user) => user.role === role);
  }

  res.json(paginateResults(filteredUsers, page, limit));
});

// Get a single user by ID
app.get("/users/:id", (req, res) => {
  const user = database.users.find((u) => u.id === req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({
      message: "User not found",
      code: "USER_NOT_FOUND",
      status: 404,
    });
  }
});

// Create a new user
app.post("/users", (req, res) => {
  const newUser = {
    ...req.body,
    id: `u${database.users.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  database.users.push(newUser);
  saveDatabase();
  res.status(201).json(newUser);
});

// Update an existing user
app.put("/users/:id", (req, res) => {
  const index = database.users.findIndex((u) => u.id === req.params.id);
  if (index !== -1) {
    database.users[index] = {
      ...database.users[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase();
    res.json(database.users[index]);
  } else {
    res.status(404).json({
      message: "User not found",
      code: "USER_NOT_FOUND",
      status: 404,
    });
  }
});

// Delete a user
app.delete("/users/:id", (req, res) => {
  const index = database.users.findIndex((u) => u.id === req.params.id);
  if (index !== -1) {
    const deletedUser = database.users[index];
    database.users.splice(index, 1);
    saveDatabase();
    res.json(deletedUser);
  } else {
    res.status(404).json({
      message: "User not found",
      code: "USER_NOT_FOUND",
      status: 404,
    });
  }
});

// Get user profile (mock implementation)
app.get("/users/profile", (req, res) => {
  // In a real app, this would use authentication to determine the current user
  // For this example, we'll just return the first user as a mock
  res.json(database.users[0]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
