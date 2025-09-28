// useDashboard.ts
import { useQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import {
  geTreviewDistribution,
  getSpinsOverTime,
  getTopRewardsClaimed,
} from "../api";

// API function params
interface SpinsQuery {
  filter?: string;
  // you can add more query params if needed, e.g., dateRange
}

export const useSpinsOverTime = (queryParams: SpinsQuery) => {
  return useQuery({
    queryKey: ["spinsOverTime", queryParams],
    queryFn: async () => {
      // Get session dynamically
      const session = await getSession();
      const token = session?.user?.accessToken;

      if (!token) throw new Error("No access token found");

      // Call API and pass token
      return getSpinsOverTime(queryParams, token);
    },
  });
};

// review-distribution hook
// API function params
interface ReviewDistributionQuery {
  filter?: "daily" | "weekly" | "monthly";
  // add more params if needed
}

export const useReviewDistribution = (queryParams: ReviewDistributionQuery) => {
  return useQuery({
    queryKey: ["reviewDistribution", queryParams],
    queryFn: async () => {
      // Get session dynamically
      const session = await getSession();
      const token = session?.user?.accessToken;

      if (!token) throw new Error("No access token found");

      // Call API and pass token
      return geTreviewDistribution(queryParams, token);
    },
  });
};

// admin analytics top-rewards-claimed Hook
interface TopRewardsQuery {
  filter?: "daily" | "weekly" | "monthly";
  page?: number;
  limit?: number;
}

export const useTopRewardsClaimed = (queryParams: TopRewardsQuery) => {
  return useQuery({
    queryKey: ["topRewardsClaimed", queryParams],
    queryFn: async () => {
      const session = await getSession();
      const token = session?.user?.accessToken;

      if (!token) throw new Error("No access token found");

      return getTopRewardsClaimed(queryParams, token);
    }
  });
};
