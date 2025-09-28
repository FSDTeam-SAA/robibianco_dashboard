"use client"
// import { Filter } from 'lucide-react';

import type { Review, PaginationParams, PaginationMeta } from "@/types/types"
import { useState, useEffect, useCallback } from "react"
import { fetchReviews } from "@/lib/api"

interface UseReviewsOptions {
  initialPage?: number
  initialLimit?: number
}

export function useReviews(searchQuery: string, options: UseReviewsOptions = {}) {
  const { initialPage = 1, initialLimit = 10 } = options

  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: initialPage,
    limit: initialLimit,
    totalReviews: 0,
    totalPages: 0,
  })

  console.log(searchQuery)

  const fetchReviewsData = useCallback(
    async (params?: PaginationParams) => {
      try {
        setLoading(true)
        setError(null)

        const paginationParams = params || {
          searchQuery,
          page: pagination.page,
          limit: pagination.limit,
        }

        const response = await fetchReviews(paginationParams)
        const data = response.data

        setReviews(data.reviews)
        setPagination({
          page: data.page,
          limit: data.limit,
          totalReviews: data.totalReviews,
          totalPages: data.totalPages,
        })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch reviews"
        console.error("Error fetching reviews:", err)
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    [pagination.page, pagination.limit, searchQuery],
  )

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= pagination.totalPages) {
        fetchReviewsData({searchQuery , page, limit: pagination.limit })
      }
    },
    [pagination.totalPages, pagination.limit, fetchReviewsData, searchQuery],
  )

  const changePageSize = useCallback(
    (limit: number) => {
      fetchReviewsData({searchQuery, page: 1, limit })
    },
    [fetchReviewsData, searchQuery],
  )

  const nextPage = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      goToPage(pagination.page + 1)
    }
  }, [pagination.page, pagination.totalPages, goToPage])

  const previousPage = useCallback(() => {
    if (pagination.page > 1) {
      goToPage(pagination.page - 1)
    }
  }, [pagination.page, goToPage])

  useEffect(() => {
    fetchReviewsData()
  }, [searchQuery, pagination.page, pagination.limit, fetchReviewsData])

  // const updateReviewStatus = useCallback(
  //   async (id: string, status: Review["rewardClaimedStatus"]) => {
  //     try {
  //       // Create optimistic update first
  //       setReviews((prev) =>
  //         prev.map((review) => (review._id === id ? { ...review, rewardClaimedStatus: status } : review)),
  //       )

  //       await updateReviewStatusApi(id, status)
  //     } catch (err) {
  //       // Revert optimistic update on error
  //       fetchReviewsData()

  //       const errorMessage = err instanceof Error ? err.message : "Failed to update review status"
  //       setError(errorMessage)
  //       throw err
  //     }
  //   },
  //   [fetchReviewsData],
  // )

  // Helper function to retry failed requests
  const retry = useCallback(() => {
    fetchReviewsData()
  }, [fetchReviewsData])

  // Clear error function
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    reviews,
    loading,
    error,
    pagination,
    // updateReviewStatus,
    retry,
    clearError,
    refetch: fetchReviewsData,
    goToPage,
    nextPage,
    previousPage,
    changePageSize,
  }
}
