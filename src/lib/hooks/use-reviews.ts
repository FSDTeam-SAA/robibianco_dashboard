"use client"

import { useState, useEffect } from "react"
import type { Review } from "@/lib/types"
import { mockReviews } from "@/lib/data/mock-data"

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call
    const fetchReviews = async () => {
      try {
        setLoading(true)
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500))
        setReviews(mockReviews)
      } catch (err) {
        setError("Failed to fetch reviews")
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const updateReviewStatus = async (id: string, status: Review["status"]) => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setReviews((prev) => prev.map((review) => (review.id === id ? { ...review, status } : review)))
    } catch (err) {
      setError("Failed to update review status")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteReview = async (id: string) => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setReviews((prev) => prev.filter((review) => review.id !== id))
    } catch (err) {
      setError("Failed to delete review")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    reviews,
    loading,
    error,
    updateReviewStatus,
    deleteReview,
  }
}
