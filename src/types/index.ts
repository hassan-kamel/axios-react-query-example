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
  userId: string;
  products: OrderProduct[];
  total: number;
  status: OrderStatus;
}

/**
 * Order product interface for products within an order
 */
export interface OrderProduct {
  productId: string;
  quantity: number;
  price: number;
}

/**
 * User entity interface
 */
export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

/**
 * Possible order statuses
 */
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

/**
 * User roles for authorization
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
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
