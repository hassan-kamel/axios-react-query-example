import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { queryClient, queryKeys } from "../../../api/queryClient";
import { Product, ApiError, PaginationParams } from "../../../types";
import ProductService from "../services/ProductService";

export const useProducts = (params?: PaginationParams) => {
  return useQuery({
    queryKey: [...queryKeys.products.all, params],
    queryFn: () => ProductService.getAll(params),
  });
};

export const useProduct = (id: string): UseQueryResult<Product, ApiError> => {
  return useQuery({
    queryKey: queryKeys.products.byId(id),
    queryFn: () => ProductService.getById(id),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newProduct: Omit<Product, "id" | "createdAt" | "updatedAt">) =>
      ProductService.create(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      ProductService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.byId(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await ProductService.delete(id);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.byId(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
};
