import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { queryClient, queryKeys } from '../api/queryClient';
import ProductService from '../services/ProductService';
import { Product, PaginationParams, PaginatedResponse, ApiError } from '../types';

/**
 * Hook for fetching all products
 * @param params - Optional pagination parameters
 * @returns Query result with products data
 */
export const useProducts = (
  params?: PaginationParams
): UseQueryResult<PaginatedResponse<Product>, ApiError> => {
  return useQuery({
    queryKey: [...queryKeys.products.all, params],
    queryFn: () => ProductService.getAll(params),
    meta: {
      errorMessage: 'Failed to fetch products',
    },
  });
};

/**
 * Hook for fetching a single product
 * @param id - Product ID
 * @returns Query result with product data
 */
export const useProduct = (id: string): UseQueryResult<Product, ApiError> => {
  return useQuery({
    queryKey: queryKeys.products.byId(id),
    queryFn: () => ProductService.getById(id),
    meta: {
      errorMessage: 'Failed to fetch product details',
    },
  });
};

/**
 * Hook for creating a new product
 * @returns Mutation result for product creation
 */
export const useCreateProduct = (): UseMutationResult<
  Product,
  ApiError,
  Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
> => {
  return useMutation({
    mutationFn: (product) => ProductService.create(product),
    meta: {
      successMessage: 'Product created successfully',
      errorMessage: 'Failed to create product',
      invalidateQueries: queryKeys.products.all,
    },
    onSuccess: () => {
      // Invalidate products cache to refetch the updated list
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
};

/**
 * Hook for updating an existing product
 * @returns Mutation result for product update
 */
export const useUpdateProduct = (): UseMutationResult<
  Product,
  ApiError,
  { id: string; data: Partial<Product> }
> => {
  return useMutation({
    mutationFn: ({ id, data }) => ProductService.update(id, data),
    meta: {
      successMessage: 'Product updated successfully',
      errorMessage: 'Failed to update product',
    },
    onSuccess: (_, variables) => {
      // Invalidate specific product cache and products list
      queryClient.invalidateQueries({ queryKey: queryKeys.products.byId(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
};

/**
 * Hook for deleting a product
 * @returns Mutation result for product deletion
 */
export const useDeleteProduct = (): UseMutationResult<void, ApiError, string> => {
  return useMutation({
    mutationFn: (id) => ProductService.delete(id),
    meta: {
      successMessage: 'Product deleted successfully',
      errorMessage: 'Failed to delete product',
    },
    onSuccess: () => {
      // Invalidate products cache to refetch the updated list
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
};

/**
 * Hook for fetching products by category
 * @param category - Product category
 * @param params - Optional pagination parameters
 * @returns Query result with products data
 */
export const useProductsByCategory = (
  category: string,
  params?: PaginationParams
): UseQueryResult<PaginatedResponse<Product>, ApiError> => {
  return useQuery({
    queryKey: [...queryKeys.products.byCategory(category), params],
    queryFn: () => ProductService.getByCategory(category, params),
    meta: {
      errorMessage: 'Failed to fetch products by category',
    },
  });
};
