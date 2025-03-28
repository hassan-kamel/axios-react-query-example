/**
 * Common interfaces and types used throughout the application
 */

/**
 * Base entity interface with common fields
 */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Product entity interface
 */
export interface Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

/**
 * Order entity interface
 */
export interface Order extends BaseEntity {
  customerName: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: string;
  orderDate: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

/**
 * User entity interface
 */

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
  password?: string;
}

/**
 * Possible order statuses
 */
export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

/**
 * User roles for authorization
 */
export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  USER = "user",
}

/**
 * User entity interface
 */
export interface User extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
  password?: string;
}

/**
 * API error response interface
 */
export interface ApiError {
  message: string;
  code: string;
  status: number;
}

/**
 * Pagination parameters interface
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Generic paginated response interface
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface OrderCreateInput {
  customerName: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: string;
  status: OrderStatus;
}

export interface OrderUpdateInput {
  customerName?: string;
  items?: OrderItem[];
  status?: OrderStatus;
  shippingAddress?: string;
}
