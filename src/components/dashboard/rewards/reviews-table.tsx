"use client"

import type React from "react"

import { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Pagination } from "@/components/ui/pagination"
import type { Reward } from "@/lib/types"

const columnHelper = createColumnHelper<Reward>()

interface RewardsTableProps {
  rewards: Reward[]
  loading: boolean
  onEditReward: (reward: Reward) => void
  onDeleteReward: (id: string) => void
}

export function RewardsTable({ rewards, loading, onEditReward, onDeleteReward }: RewardsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  })

  const columns = [
    columnHelper.accessor("rewardName", {
      header: "Rewards Name",
      cell: (info) => <div className="font-medium">{info.getValue()}</div>,
    }),
    columnHelper.accessor("description", {
      header: "Description",
      cell: (info) => <div className="text-muted-foreground">{info.getValue()}</div>,
    }),
    columnHelper.accessor("couponCode", {
      header: "Coupon Code",
      cell: (info) => <div className="font-mono text-sm">{info.getValue()}</div>,
    }),
    columnHelper.accessor("expiry", {
      header: "Expiry",
      cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info) => <div>{info.getValue()}</div>,
    }),
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
            <Progress
              value={percentage}
              className="h-2"
              style={
                {
                  "--progress-background": percentage > 50 ? "#6366f1" : "#f97316",
                } as React.CSSProperties
              }
            />
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
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => onDeleteReward(info.row.original.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
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
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading rewards...</div>
      </div>
    )
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
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {pagination.pageIndex * pagination.pageSize + 1} to{" "}
          {Math.min((pagination.pageIndex + 1) * pagination.pageSize, rewards.length)} of {rewards.length} results
        </p>
        <Pagination
          currentPage={pagination.pageIndex + 1}
          totalPages={table.getPageCount()}
          onPageChange={(page) => table.setPageIndex(page - 1)}
        />
      </div>
    </div>
  )
}
