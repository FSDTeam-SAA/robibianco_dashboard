
"use client";

// import { Button } from "@/components/ui/button";
// import { Filter, Download, ChevronDown } from "lucide-react";
import { ReviewsTable } from "./reviews-table";
// import { useState } from "react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { useReviews } from "@/lib/hooks/use-reviews";

export function ReviewsContent() {
  // const [timeFilter, setTimeFilter] = useState<string>("all");
  const { reviews } = useReviews();

  // const handleFilterSelect = (filter: string) => {
  //   setTimeFilter(filter);
  // };
  console.log("revihkjkjkj", reviews);

  // Export CSV
  // const handleExportCSV = () => {
  //   if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
  //     return alert("No data to export");
  //   }

  //   const headers = [
  //     "Name",
  //     "Email",
  //     "Phone",
  //     "Rating",
  //     "Comment",
  //     "Prize Code",
  //     "Reward Status",
  //     "Created At",
  //   ];

  //   const rows = (reviews as any[]).map((r: any) => [
  //     r.name || "",
  //     r.email || "",
  //     r.phone || "",
  //     r.rating?.toString() || "",
  //     `"${(r.comment || "").replace(/"/g, '""')}"`,
  //     r.prizeCode || "",
  //     r.rewardClaimedStatus || "",
  //     new Date(r.createdAt).toLocaleString(),
  //   ]);

  //   const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
  //   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.setAttribute(
  //     "download",
  //     `reviews-${timeFilter}-${new Date().toISOString().split("T")[0]}.csv`
  //   );
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  //   URL.revokeObjectURL(url);
  // };

  // const getFilterLabel = (filter: string) => {
  //   const labels: { [key: string]: string } = {
  //     all: "All Time",
  //     daily: "Today",
  //     weekly: "Last Week",
  //     monthly: "Last Month",
  //   };
  //   return labels[filter] || filter;
  // };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Review Management</h1>
        {/* <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center space-x-2 bg-transparent"
              >
                <Filter className="h-4 w-4" />
                <span>{getFilterLabel(timeFilter)}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleFilterSelect("all")}>
                All Time
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterSelect("today")}>
                Today
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterSelect("lastWeek")}>
                Last Week
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterSelect("lastMonth")}>
                Last Month
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="flex items-center space-x-2 bg-[#6366f1] text-white hover:bg-[#6366f1]/90 cursor-pointer"
            disabled={Array.isArray(reviews) ? reviews.length === 0 : true}
          >
            <Download className="h-4 w-4" />
            <span>Export as .csv</span>
          </Button>
        </div> */}
      </div>

      <ReviewsTable />
    </div>
  );
}
