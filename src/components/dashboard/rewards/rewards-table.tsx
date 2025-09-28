"use client"

import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import type { Reward } from "@/types/types"

const columnHelper = createColumnHelper<Reward>()

interface RewardsPaginationMeta {
  page: number
  limit: number
  totalRewards: number
  totalPages: number
}

interface RewardsTableProps {
  rewards: Reward[]
  loading: boolean
  pagination: RewardsPaginationMeta
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onEditReward: (reward: Reward) => void
  onDeleteReward: (id: string) => void
}

export function RewardsTable({
  rewards,
  loading,
  pagination,
  onPageChange,
  onPageSizeChange,
  onEditReward,
  onDeleteReward,
}: RewardsTableProps) {
  const columns = [
    columnHelper.accessor("rewardName", { header: "Reward Name" }),
    columnHelper.accessor("description", { header: "Description" }),
    columnHelper.accessor("couponCode", { header: "Coupon Code" }),
    columnHelper.accessor("expiry", { header: "Expiry (days)" }),
    columnHelper.accessor("date", { header: "Created Date" }),
    columnHelper.accessor("stock", {
      header: "Stock",
      cell: (info) => {
        const stock = info.getValue()
        const maxStock = info.row.original.maxStock
        const percentage = (stock / maxStock) * 100
        return (
          <div className="space-y-2 min-w-[120px]">
            <div className="text-sm font-medium">
              {stock} / {maxStock}
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        )
      },
    }),
    columnHelper.display({
      id: "actions",
      cell: (info) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEditReward(info.row.original)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => onDeleteReward(info.row.original.id)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ]

  const table = useReactTable({
    data: rewards,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading rewards...</div>
  }

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No rewards found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.totalRewards)} of {pagination.totalRewards} results
          </p>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select value={pagination.limit.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex items-center space-x-1">
              <Button variant="outline" size="sm" onClick={() => onPageChange(1)} disabled={pagination.page === 1}>
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.totalPages)}
                disabled={pagination.page === pagination.totalPages}
              >
                Last
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
