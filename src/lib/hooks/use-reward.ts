"use client"

import { useState, useEffect } from "react"
import type { Reward } from "@/lib/types"
import { mockRewards } from "@/lib/data/mock-data"

export function useRewards() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call
    const fetchRewards = async () => {
      try {
        setLoading(true)
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500))
        setRewards(mockRewards)
      } catch (err) {
        setError("Failed to fetch rewards")
      } finally {
        setLoading(false)
      }
    }

    fetchRewards()
  }, [])

  const createReward = async (rewardData: Omit<Reward, "id" | "createdAt" | "updatedAt">) => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newReward: Reward = {
        ...rewardData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      setRewards((prev) => [...prev, newReward])
      return newReward
    } catch (err) {
      setError("Failed to create reward")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateReward = async (id: string, rewardData: Partial<Reward>) => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setRewards((prev) =>
        prev.map((reward) => (reward.id === id ? { ...reward, ...rewardData, updatedAt: new Date() } : reward)),
      )
    } catch (err) {
      setError("Failed to update reward")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteReward = async (id: string) => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setRewards((prev) => prev.filter((reward) => reward.id !== id))
    } catch (err) {
      setError("Failed to delete reward")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    rewards,
    loading,
    error,
    createReward,
    updateReward,
    deleteReward,
  }
}
