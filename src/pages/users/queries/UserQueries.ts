import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "../../../types";
import { axiosClient } from "../../../api/axiosClient";
import { UserEndpoints } from "../../../api/endpoints";
import { queryKeys } from "../../../api/queryClient";

// Get single user
export const useUser = (id: string) => {
  return useQuery({
    queryKey: queryKeys.users.byId(id),
    queryFn: async () => {
      const { data } = await axiosClient.get<User>(UserEndpoints.getById(id));
      return data;
    },
  });
};

// Get users list
export const useUsers = (params?: string) => {
  return useQuery({
    queryKey: [...queryKeys.users.all, params],
    queryFn: async () => {
      const { data } = await axiosClient.get(UserEndpoints.getAll(params));
      return data;
    },
  });
};

// Create user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      newUser: Omit<User, "id" | "createdAt" | "updatedAt">
    ) => {
      const { data } = await axiosClient.post<User>(
        UserEndpoints.create(),
        newUser
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      const response = await axiosClient.put<User>(
        UserEndpoints.update(id),
        data
      );
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.byId(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axiosClient.delete(UserEndpoints.delete(id));
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.byId(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};
