"use client";

import { PaginationParams, Reward } from "@/types/types";
import { useState, useEffect, useCallback } from "react";
import { createRewardApi, rewardsdata } from "../api";

interface RewardsPaginationMeta {
  page: number;
  limit: number;
  totalRewards: number;
  totalPages: number;
}

interface UseRewardsOptions {
  initialPage?: number;
  initialLimit?: number;
}

export function useRewards(options: UseRewardsOptions = {}) {
  const { initialPage = 1, initialLimit = 10 } = options;

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<RewardsPaginationMeta>({
    page: initialPage,
    limit: initialLimit,
    totalRewards: 0,
    totalPages: 1,
  });

  const fetchRewardsData = useCallback(async (params: PaginationParams) => {
    try {
      setLoading(true);
      setError(null);

      const response = await rewardsdata(pagination.page);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedRewards: Reward[] = response.data.rewards.map((r: any) => ({
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

      setRewards(mappedRewards);
      setPagination({
        page: response.data.page,
        limit: response.data.limit,
        totalRewards: response.data.totalRewards,
        totalPages: response.data.totalPages,
      });
    } catch (err) {
      console.error("Failed to fetch rewards:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch rewards");
    } finally {
      setLoading(false);
    }
  }, []);

  const goToPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const nextPage = useCallback(() => {
    setPagination((prev) =>
      prev.page < prev.totalPages ? { ...prev, page: prev.page + 1 } : prev
    );
  }, []);

  const previousPage = useCallback(() => {
    setPagination((prev) =>
      prev.page > 1 ? { ...prev, page: prev.page - 1 } : prev
    );
  }, []);

  const changePageSize = useCallback((limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  const createReward = useCallback(
    async (rewardData: {
      rewardName: string;
      description: string;
      couponCode: string;
      stockLimit: number;
      expiryDays: number;
      requireReview?: boolean;
    }) => {
      try {
        setLoading(true);
        await createRewardApi(rewardData);
        // Refresh current page after creation
        await fetchRewardsData({
          page: pagination.page,
          limit: pagination.limit,
        });
      } catch (err) {
        console.error("Failed to create reward:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchRewardsData, pagination.page, pagination.limit]
  );

  // const updateRewardById = useCallback(
  //   async (id: string, rewardData: Partial<CreateRewardPayload>) => {
  //     try {
  //       setLoading(true);
  //       await updateReward(id, rewardData);
  //       // Refresh current page after update
  //       await fetchRewardsData({
  //         page: pagination.page,
  //         limit: pagination.limit,
  //       });
  //     } catch (err) {
  //       console.error("Failed to update reward:", err);
  //       throw err;
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [fetchRewardsData, pagination.page, pagination.limit]
  // );

  // const deleteRewardById = useCallback(
  //   async (id: string) => {
  //     try {
  //       setLoading(true);
  //       await deleteReward(id);
  //       // Refresh current page after deletion
  //       await fetchRewardsData({
  //         page: pagination.page,
  //         limit: pagination.limit,
  //       });
  //     } catch (err) {
  //       console.error("Failed to delete reward:", err);
  //       throw err;
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [fetchRewardsData, pagination.page, pagination.limit]
  // );

  const refresh = useCallback(() => {
    fetchRewardsData({ page: pagination.page, limit: pagination.limit });
  }, [fetchRewardsData, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchRewardsData({ page: pagination.page, limit: pagination.limit });
  }, [fetchRewardsData, pagination.page, pagination.limit]);

  return {
    rewards,
    loading,
    error,
    pagination,
    // Pagination controls
    goToPage,
    nextPage,
    previousPage,
    changePageSize,
    // CRUD operations
    createReward,
    // updateReward: updateRewardById,
    // deleteReward: deleteRewardById,
    refresh,
  };
}
