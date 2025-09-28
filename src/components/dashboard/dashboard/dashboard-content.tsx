"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { useDashboardStats } from "@/lib/hooks/use-dashboard-stats";
import { SpinsOverTimeChart } from "./spins-over-time-chart";
import { ReviewDistributionChart } from "./review-distribution-chart";
import { TopRewardsTable } from "./top-rewards-table";
import {
  useReviewDistribution,
  useSpinsOverTime,} from "@/lib/hooks/useDashboard";

interface SpinOverTimeItem {
  label: string;
  count: number;
}

// Define the filter type
type FilterType = "daily" | "weekly" | "monthly";

export function DashboardContent() {
  // const { stats, loading } = useDashboardStats();

  // Local state for filter
  const [filter, setFilter] = useState<FilterType>("daily");

  const { data: spinsData } = useSpinsOverTime({ filter });
  const { data: reviewData, isLoading: reviewLoading } = useReviewDistribution({
    filter,
  });


  // Transform API data for Spins chart
  const chartData =
    spinsData?.map((item: SpinOverTimeItem) => ({
      day: item.label,
      spins: item.count,
    })) || [];
 
 

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
        {/* Spins Over Time Chart */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border">
            <div className="flex items-center justify-between mb-4 p-6">
              <h2 className="text-2xl font-semibold text-[#1F2937]">
                Spins Over Time
              </h2>
              <Select
                value={filter}
                onValueChange={(value: string) => {
                  if (
                    value === "daily" ||
                    value === "weekly" ||
                    value === "monthly"
                  ) {
                    setFilter(value);
                  }
                }}
              >
                <SelectTrigger className="w-24 text-[#1F2937]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <SpinsOverTimeChart data={chartData} />
          </div>
        </div>

        {/* Review Distribution Chart */}
        <div>
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-6 text-[#1F2937]">
              Review Distribution
            </h2>
            {!reviewLoading && reviewData ? (
              <ReviewDistributionChart data={reviewData} />
            ) : (
              <div className="text-muted-foreground">Loading chart...</div>
            )}
          </div>
        </div>
      </div>

      {/* Top Rewards Claimed Table */}
      <div className="bg-card rounded-lg border p-6">
        <TopRewardsTable />
      </div>
    </div>
  );
}
