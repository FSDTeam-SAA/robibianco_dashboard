"use client"

import { Button } from "@/components/ui/button"
import { Filter, Download } from "lucide-react"
import { ReviewsTable } from "./reviews-table"

export function ReviewsContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Review Management</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center space-x-2 bg-[#6366f1] text-white hover:bg-[#6366f1]/90"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <ReviewsTable />
    </div>
  )
}
