import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Order } from "../../../types";
import { axiosClient } from "../../../api/axiosClient";
import { OrderEndpoints } from "../../../api/endpoints";
import { queryKeys } from "../../../api/queryClient";

// Get single order
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: queryKeys.orders.byId(id),
    queryFn: async () => {
      const { data } = await axiosClient.get<Order>(OrderEndpoints.getById(id));
      return data;
    },
  });
};

// Get orders list
export const useOrders = (params?: string) => {
  return useQuery({
    queryKey: [...queryKeys.orders.all, params],
    queryFn: async () => {
      const { data } = await axiosClient.get(OrderEndpoints.getAll(params));
      return data;
    },
  });
};

// Get orders by user
export const useUserOrders = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.orders.byUser(userId),
    queryFn: async () => {
      const { data } = await axiosClient.get(OrderEndpoints.getByUser(userId));
      return data;
    },
  });
};

// Update order
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Order> }) => {
      const response = await axiosClient.put<Order>(OrderEndpoints.update(id), data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.byId(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
};

// Delete order
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosClient.delete(OrderEndpoints.delete(id));
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.byId(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
};
