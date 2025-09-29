"use client";

import { Button } from "@/components/ui/button";
import { Filter, Download, ChevronDown } from "lucide-react";
import { ReviewsTable } from "./reviews-table";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Review } from "@/types/types";

export function ReviewsContent() {
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [reviewData, setReviewData] = useState<Review[]>([]);

  const handleFilterSelect = (filter: string) => {
    setTimeFilter(filter);
  };
  console.log('rewview data',reviewData)

  // ✅ Export to CSV function
  const handleExportCSV = () => {
    if (!reviewData || reviewData.length === 0) {
      alert("No data available to export");
      return;
    }

    // CSV Header
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Rating",
      "Comment",
      "Prize Code",
      "Reward Status",
      "Created At",
    ];

    // CSV Rows
    const rows = reviewData.map((item) => [
      item.name,
      item.email,
      item.phone,
      item.rating,
      item.comment,
      item.prizeCode,
      item.rewardClaimedStatus,
      new Date(item.createdAt).toLocaleString(),
    ]);

    // Join CSV
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    // Create Blob
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Trigger download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "reviews_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Review Management</h1>
        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center space-x-2 bg-transparent"
              >
                <Filter className="h-4 w-4" />
                <span>{timeFilter}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleFilterSelect("all")}>
                All Time
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterSelect("daily")}>
                Today
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterSelect("weekly")}>
                Last Week
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterSelect("monthly")}>
                Last Month
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="flex items-center space-x-2 bg-[#6366f1] text-white hover:bg-[#6366f1]/90 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export as .csv</span>
          </Button>
        </div>
      </div>

      <ReviewsTable timeFilter={timeFilter} setReviewData={setReviewData} />
    </div>
  );
}
