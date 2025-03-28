/**
 * API endpoint configurations
 * Centralized endpoint management for the application
 */

/**
 * Product-related endpoints
 */
export const ProductEndpoints = {
  /** Get all products with optional filtering */
  getAll: (params?: string) => `/products${params ? `?${params}` : ""}`,

  /** Get a single product by ID */
  getById: (id: string) => `/products/${id}`,

  /** Create a new product */
  create: () => "/products",

  /** Update an existing product */
  update: (id: string) => `/products/${id}`,

  /** Delete a product */
  delete: (id: string) => `/products/${id}`,

  /** Get products by category */
  getByCategory: (category: string) => `/products/category/${category}`,
} as const;

/**
 * Order-related endpoints
 */
export const OrderEndpoints = {
  /** Get all orders with optional filtering */
  getAll: (params?: string) => `/orders${params ? `?${params}` : ""}`,

  /** Get a single order by ID */
  getById: (id: string) => `/orders/${id}`,

  /** Create a new order */
  create: () => "/orders",

  /** Update an existing order */
  update: (id: string) => `/orders/${id}`,

  /** Delete an order */
  delete: (id: string) => `/orders/${id}`,

  /** Get orders for a specific user */
  getByUser: (userId: string) => `/orders/user/${userId}`,
} as const;

/**
 * User-related endpoints
 */
export const UserEndpoints = {
  /** Get all users with optional filtering */
  getAll: (params?: string) => `/users${params ? `?${params}` : ""}`,

  /** Get a single user by ID */
  getById: (id: string) => `/users/${id}`,

  /** Create a new user */
  create: () => "/users",

  /** Update an existing user */
  update: (id: string) => `/users/${id}`,

  /** Delete a user */
  delete: (id: string) => `/users/${id}`,

  /** Get user profile */
  profile: () => "/users/profile",
} as const;
