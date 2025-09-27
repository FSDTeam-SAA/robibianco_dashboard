"use client"

import { Button } from "@/components/ui/button"
import { Plus, Filter, Download } from "lucide-react"

export function UsersContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button className="bg-[#6366f1] hover:bg-[#6366f1]/90 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-8 text-center">
        <h3 className="text-lg font-medium mb-2">User Management</h3>
        <p className="text-muted-foreground">
          User management functionality will be implemented here. This includes user profiles, activity tracking, and
          user permissions management.
        </p>
      </div>
    </div>
  )
}
