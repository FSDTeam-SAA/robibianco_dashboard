// useAllUsers.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { changePassword, getAllUsers, getUserById } from "../api";

// API function params
interface UserQuery {
  filter?: string;
  page?: number;
  limit?: number;
}

export const useAllUsers = (queryParams: UserQuery) => {
  return useQuery({
    queryKey: ["users", queryParams],
    queryFn: async () => {
      // Get session dynamically
      const session = await getSession();
      const token = session?.user?.accessToken;

      if (!token) throw new Error("No access token found");

      // Call API and pass token
      return getAllUsers(queryParams, token);
    },
  });
};

// Hook for fetching a single user by ID
export const useUserById = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");

      // Get session dynamically
      const session = await getSession();
      const token = session?.user?.accessToken;

      if (!token) throw new Error("No access token found");

      // Call API and pass token
      return getUserById(userId, token);
    },
    enabled: !!userId,  
  });
};

interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}



// Hook for changing password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
      confirmPassword,
    }: ChangePasswordInput) => {
      const session = await getSession();
      const token = session?.user?.accessToken;

      if (!token) throw new Error("No access token found");

      // Call API with token
      return changePassword(currentPassword, newPassword, confirmPassword, token);
    },
  });
};