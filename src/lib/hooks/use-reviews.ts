"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Review, PaginationParams, PaginationMeta } from "@/types/types";
import { fetchReviews } from "@/lib/api";

interface UseReviewsOptions {
  initialPage?: number;
  initialLimit?: number;
}

interface ReviewsResponse {
  reviews: Review[];
  page: number;
  limit: number;
  totalReviews: number;
  totalPages: number;
}

export function useReviews(
  timeFilter: string = "all",
  options: UseReviewsOptions = {}
) {
  const { initialPage = 1, initialLimit = 10 } = options;

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);


  useEffect(() => {
    setPage(1);
  }, [timeFilter]);

  const {
    data,
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useQuery<ReviewsResponse>({
    queryKey: ["reviews", timeFilter, page, limit],
    queryFn: async () => {
      const params: PaginationParams & { timeFilter?: string } = {
        searchQuery: "",
        page,
        limit,
        timeFilter: timeFilter, 
      };

    

      const response = await fetchReviews(params);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const pagination: PaginationMeta = {
    page: data?.page ?? page,
    limit: data?.limit ?? limit,
    totalReviews: data?.totalReviews ?? 0,
    totalPages: data?.totalPages ?? 0,
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  const nextPage = () => {
    if (pagination.page < pagination.totalPages) setPage((prev) => prev + 1);
  };

  const previousPage = () => {
    if (pagination.page > 1) setPage((prev) => prev - 1);
  };

  const changePageSize = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return {
    reviews: data?.reviews ?? [],
    pagination,
    loading,
    error: isError ? (error as Error)?.message ?? "An error occurred" : null,
    refetch,
    goToPage,
    nextPage,
    previousPage,
    changePageSize,
  };
}
