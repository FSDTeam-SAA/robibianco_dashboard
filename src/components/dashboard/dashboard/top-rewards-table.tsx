"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTopRewardsClaimed } from "@/lib/hooks/useDashboard";
import { Star } from "lucide-react";

interface RewardItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  comment?: string;
  rating?: number;
  spinResult?: { rewardName: string } | null;
}

export function TopRewardsTable() {
  const [filter, setFilter] = useState<"daily" | "weekly" | "monthly">("daily");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useTopRewardsClaimed({
    filter,
    page,
    limit: 10,
  });

  const rewards: RewardItem[] = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="overflow-x-auto rounded-md border p-4">
      {/* Header & Filter */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#1F2937]">
          Top Rewards Claimed
        </h2>
        <Select
          value={filter}
          onValueChange={(value: string) => {
            if (["daily", "weekly", "monthly"].includes(value)) {
              setFilter(value as "daily" | "weekly" | "monthly");
              setPage(1);
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

      {/* Table */}
      <div className="text-center rounded-md overflow-hidden">
        <Table className="border-separate border-spacing-y-2">
          <TableHeader>
            <TableRow className="font-medium">
              <TableHead className="border text-center">User Name</TableHead>
              <TableHead className="border text-center">User Email</TableHead>
              <TableHead className="border text-center">Contact Number</TableHead>
              <TableHead className="border text-center">Comment</TableHead>
              <TableHead className="border text-center">Reward</TableHead>
              <TableHead className="border text-center">Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rewards.length > 0 ? (
              rewards.map((reward: RewardItem) => (
                <TableRow
                  key={reward._id}
                  className="hover:bg-gray-50 border rounded-lg text-[#1F2937]"
                >
                  <TableCell className="border">{reward.name}</TableCell>
                  <TableCell className="border">{reward.email}</TableCell>
                  <TableCell className="border">{reward.phone}</TableCell>
                  <TableCell className="border">{reward.comment || "-"}</TableCell>
                  <TableCell className="border">
                    {reward.spinResult?.rewardName || "N/A"}
                  </TableCell>
                  <TableCell className="flex justify-center border space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < (reward.rating || 0)
                            ? "text-orange-400 fill-orange-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center border">
                  No rewards found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Showing page {page} of {totalPages} ({data?.meta?.total || 0} rewards)
        </p>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="border-[#6366F1] text-[#3C3C3C] bg-white hover:bg-gray-100 cursor-pointer"
          >
            {"<"}
          </Button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              size="sm"
              variant={page === i + 1 ? "default" : "outline"}
              onClick={() => setPage(i + 1)}
              className={
                page === i + 1
                  ? "bg-[#6366F1] text-black border-black cursor-pointer hover:bg-[#6366F1]"
                  : "bg-white text-black border-black hover:bg-gray-100 cursor-pointer"
              }
            >
              {i + 1}
            </Button>
          ))}
          <Button
            size="sm"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="border-[#6366F1] text-[#3C3C3C] bg-white hover:bg-gray-100 cursor-pointer"
          >
            {">"}
          </Button>
        </div>
      </div>
    </div>
  );
}
