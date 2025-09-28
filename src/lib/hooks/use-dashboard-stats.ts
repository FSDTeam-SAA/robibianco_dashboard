"use client"

import { useState, useEffect } from "react"

import { mockDashboardStats } from "@/lib/data/mock-data"
import { DashboardStats } from "@/types/types"

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call
    const fetchStats = async () => {
      try {
        setLoading(true)
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500))
        setStats(mockDashboardStats)
      } catch   {
        setError("Failed to fetch dashboard stats")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const refreshStats = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setStats(mockDashboardStats)
    } catch  {
      setError("Failed to refresh stats")
    } finally {
      setLoading(false)
    }
  }

  return {
    stats,
    loading,
    error,
    refreshStats,
  }
}
