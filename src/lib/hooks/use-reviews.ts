"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type {
  Review,
  PaginationParams,
  PaginationMeta,

} from "@/types/types";
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

export function useReviews(searchQuery: string, options: UseReviewsOptions = {}) {
  const { initialPage = 1, initialLimit = 10 } = options;

  // Local state to control pagination
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  // Query
  const {
    data,
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useQuery<ReviewsResponse>({
    queryKey: ["reviews", searchQuery, page, limit],
    queryFn: async () => {
      const params: PaginationParams = { searchQuery, page, limit };
      const response = await fetchReviews(params);
      return response.data;
    },
   
  });

  // Build pagination meta from query response
  const pagination: PaginationMeta = {
    page: data?.page ?? page,
    limit: data?.limit ?? limit,
    totalReviews: data?.totalReviews ?? 0,
    totalPages: data?.totalPages ?? 0,
  };

  // Pagination handlers
  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  const changePageSize = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // reset to first page
  };

  const nextPage = () => {
    if (pagination.page < pagination.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (pagination.page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return {
    reviews: data?.reviews ?? [],
    pagination,
    loading,
    error: isError ? (error as Error).message : null,
    refetch,
    goToPage,
    nextPage,
    previousPage,
    changePageSize,
  };
}
