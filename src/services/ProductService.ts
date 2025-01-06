import axiosClient from '../api/axiosClient';
import { ProductEndpoints } from '../api/endpoints';
import { Product, PaginationParams, PaginatedResponse } from '../types';

/**
 * Service class for handling product-related API calls
 */
export default class ProductService {
  /**
   * Fetch all products with optional pagination and filtering
   * @param params - Pagination parameters
   * @returns Promise with paginated product data
   */
  static async getAll(params?: PaginationParams): Promise<PaginatedResponse<Product>> {
    const queryParams = params
      ? new URLSearchParams({
          page: params.page.toString(),
          limit: params.limit.toString(),
        }).toString()
      : '';
      
    const response = await axiosClient.get(ProductEndpoints.getAll(queryParams));
    return response.data;
  }

  /**
   * Fetch a single product by ID
   * @param id - Product ID
   * @returns Promise with product data
   */
  static async getById(id: string): Promise<Product> {
    const response = await axiosClient.get(ProductEndpoints.getById(id));
    return response.data;
  }

  /**
   * Create a new product
   * @param product - Product data
   * @returns Promise with created product
   */
  static async create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const response = await axiosClient.post(ProductEndpoints.create(), product);
    return response.data;
  }

  /**
   * Update an existing product
   * @param id - Product ID
   * @param product - Updated product data
   * @returns Promise with updated product
   */
  static async update(id: string, product: Partial<Product>): Promise<Product> {
    const response = await axiosClient.put(ProductEndpoints.update(id), product);
    return response.data;
  }

  /**
   * Delete a product
   * @param id - Product ID
   * @returns Promise with deletion status
   */
  static async delete(id: string): Promise<void> {
    await axiosClient.delete(ProductEndpoints.delete(id));
  }

  /**
   * Fetch products by category
   * @param category - Product category
   * @param params - Pagination parameters
   * @returns Promise with paginated product data
   */
  static async getByCategory(
    category: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<Product>> {
    const queryParams = params
      ? new URLSearchParams({
          page: params.page.toString(),
          limit: params.limit.toString(),
        }).toString()
      : '';
      
    const response = await axiosClient.get(
      `${ProductEndpoints.getByCategory(category)}${queryParams ? `?${queryParams}` : ''}`
    );
    return response.data;
  }
}
