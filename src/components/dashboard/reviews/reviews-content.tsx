"use client"

import { Button } from "@/components/ui/button"
import { Filter, Download, ChevronDown } from "lucide-react"
import { ReviewsTable } from "./reviews-table"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ReviewsContent() {
  const [timeFilter, setTimeFilter] = useState<string>("all")

  const handleFilterSelect = (filter: string) => {
    setTimeFilter(filter)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Review Management</h1>
        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
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
            variant="outline"
            className="flex items-center space-x-2 bg-[#6366f1] text-white hover:bg-[#6366f1]/90"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <ReviewsTable timeFilter={timeFilter} />
    </div>
  )
}