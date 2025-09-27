// useAllUsers.ts
import { useQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { getAllUsers, getUserById } from "../api";

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
    enabled: !!userId, // only run if userId exists
    staleTime: 1000 * 60 * 5, // optional cache for 5 mins
  });
};
