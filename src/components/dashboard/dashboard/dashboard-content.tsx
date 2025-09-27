"use client"


import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDashboardStats } from "@/lib/hooks/use-dashboard-stats"
import { SpinsOverTimeChart } from "./spins-over-time-chart"
import { ReviewDistributionChart } from "./review-distribution-chart"
import { TopRewardsTable } from "./top-rewards-table"


export function DashboardContent() {
  const { stats, loading } = useDashboardStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Failed to load dashboard data</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spins Over Time Chart */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Spins Over Time</h2>
              <Select defaultValue="daily">
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <SpinsOverTimeChart data={stats.spinsOverTime} />
          </div>
        </div>

        {/* Review Distribution Chart */}
        <div>
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-6">Review Distribution</h2>
            <ReviewDistributionChart positiveReviews={stats.positiveReviews} negativeReviews={stats.negativeReviews} />
          </div>
        </div>
      </div>

      {/* Top Rewards Claimed Table */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Top Rewards Claimed</h2>
          <Select defaultValue="daily">
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <TopRewardsTable />
      </div>
    </div>
  )
}
