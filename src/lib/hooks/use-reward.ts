"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createRewardApi, rewardsdata } from "../api";
import type { Reward } from "@/types/types";
import { useState } from "react";

interface RewardsPaginationMeta {
  page: number;
  limit: number;
  totalRewards: number;
  totalPages: number;
}
interface RewardApi {
  _id: string;
  rewardName: string;
  description: string;
  couponCode: string;
  stock: number;
  stockLimit: number;
  expiryDays: number;
  requiresReview: boolean;
  createdAt: string;
  updatedAt: string;
  spinResult?: Reward["spinResult"];
  rating?: number;
  comment?: string;
  prizeCode?: string;
  rewardClaimedStatus?: string;
}


interface UseRewardsOptions {
  initialPage?: number;
  initialLimit?: number;
}

export function useRewards(options: UseRewardsOptions = {}) {
  const { initialPage = 1, initialLimit = 10 } = options;
  const queryClient = useQueryClient();

  // Query state
  const [pagination, setPagination] = useState<RewardsPaginationMeta>({
    page: initialPage,
    limit: initialLimit,
    totalRewards: 0,
    totalPages: 1,
  });

  // Rewards query with pagination
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["rewards", pagination.page, pagination.limit],
    queryFn: async () => {
      const response = await rewardsdata(pagination.page, pagination.limit);

      const mappedRewards: Reward[] = response.data.rewards.map((r: RewardApi) => ({
        id: r._id,
        rewardName: r.rewardName,
        description: r.description,
        couponCode: r.couponCode,
        stock: r.stock,
        maxStock: r.stockLimit,
        expiry: r.expiryDays,
        date: new Date(r.createdAt).toLocaleDateString("en-GB"),
        requireReview: r.requiresReview,
        createdAt: new Date(r.createdAt),
        updatedAt: new Date(r.updatedAt),
      }));

      return {
        rewards: mappedRewards,
        pagination: {
          page: response.data.page,
          limit: response.data.limit,
          totalRewards: response.data.totalRewards,
          totalPages: response.data.totalPages,
        },
      };
    },

  });

  // Mutation for creating a reward
  const createReward = useMutation({
    mutationFn: createRewardApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
    },
  });

  // Pagination handlers
  const goToPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const changePageSize = (limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  };

  return {
    rewards: data?.rewards ?? [],
    pagination: data?.pagination ?? pagination,
    loading: isLoading,
    error: isError ? (error as Error).message : null,

    goToPage,
    changePageSize,
    createReward: createReward.mutateAsync,
    refresh: refetch,
  };
}
