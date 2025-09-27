"use client"

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
import { Star } from "lucide-react"
import { Pagination } from "@/components/ui/pagination"
import { useReviews } from "@/lib/hooks/use-reviews"

const columnHelper = createColumnHelper()

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? "fill-[#f97316] text-[#f97316]" : "fill-none text-gray-300"}`}
        />
      ))}
    </div>
  )
}

export function ReviewsTable() {
  const { reviews, loading } = useReviews()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  })

  const columns = [
    columnHelper.accessor("userName", {
      header: "User Name",
      cell: (info) => <div className="font-medium">{info.getValue()}</div>,
    }),
    columnHelper.accessor("userEmail", {
      header: "User Email",
      cell: (info) => <div className="text-muted-foreground">{info.getValue()}</div>,
    }),
    columnHelper.accessor("contactNumber", {
      header: "Contact Number",
      cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("comment", {
      header: "Comment",
      cell: (info) => (
        <div className="max-w-xs">
          <p className="text-sm text-muted-foreground line-clamp-2">{info.getValue()}</p>
        </div>
      ),
    }),
    columnHelper.accessor("rating", {
      header: "Reward",
      cell: (info) => <StarRating rating={info.getValue()} />,
    }),
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info) => <div>{info.getValue()}</div>,
    }),
  ]

  const table = useReactTable({
    data: reviews,
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
        <div className="text-muted-foreground">Loading reviews...</div>
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
          {Math.min((pagination.pageIndex + 1) * pagination.pageSize, reviews.length)} of {reviews.length} results
        </p>
        {/* <Pagination
          currentPage={pagination.pageIndex + 1}
          totalPages={table.getPageCount()}
          onPageChange={(page) => table.setPageIndex(page - 1)}
        /> */}
      </div>
    </div>
  )
}
