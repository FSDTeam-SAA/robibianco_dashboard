"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useReviews } from "@/lib/hooks/use-reviews";
import type { Review } from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";

const columnHelper = createColumnHelper<Review>();

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex space-x-1 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating 
              ? "fill-[#f97316] text-[#f97316]" 
              : "fill-none text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

interface ReviewsTableProps {
  timeFilter: string;
}

export function ReviewsTable({ timeFilter }: ReviewsTableProps) {
  const { 
    reviews, 
    loading, 
    error, 
    pagination, 
    goToPage, 
    nextPage, 
    previousPage 
  } = useReviews(timeFilter);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = [
    columnHelper.accessor("name", { 
      header: "User Name", 
      cell: (info) => <div className="font-medium">{info.getValue() || "N/A"}</div> 
    }),
    columnHelper.accessor("email", { 
      header: "User Email", 
      cell: (info) => <div className="text-muted-foreground">{info.getValue() || "N/A"}</div> 
    }),
    columnHelper.accessor("phone", { 
      header: "Contact Number", 
      cell: (info) => <div>{info.getValue() || "N/A"}</div> 
    }),
    columnHelper.accessor("comment", { 
      header: "Comment", 
      cell: (info) => (
        <div className="max-w-xs">
          <p className="text-sm text-muted-foreground py-2 line-clamp-2">
            {info.getValue() || "No comment"}
          </p>
        </div>
      ) 
    }),
    columnHelper.accessor("rating", { 
      header: "Rating", 
      cell: (info) => <StarRating rating={info.getValue() || 0} /> 
    }),
    columnHelper.accessor("createdAt", { 
      header: "Date", 
      cell: (info) => <div>{new Date(info.getValue()).toLocaleDateString("en-GB")}</div> 
    }),
  ];

  const table = useReactTable({
    data: reviews,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: { sorting, columnFilters },
    manualPagination: true,
    pageCount: pagination.totalPages,
  });

  // Pagination logic (current ±2 pages)
  const getVisiblePages = (current: number, total: number, delta = 2): (number | string)[] => {
    if (total <= 1) return [1];
    
    const pages: (number | string)[] = [];
    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);
    
    pages.push(1);
    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < total - 1) pages.push("...");
    if (total > 1) pages.push(total);
    return pages;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: 6 }).map((_, i) => (
                  <TableHead key={i} className="text-center">
                    <Skeleton className="h-6 w-32 mx-auto rounded-md" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j} className="text-center">
                      <Skeleton className="h-6 w-32 mx-auto rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center h-64 flex items-center justify-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder 
                      ? null 
                      : flexRender(header.column.columnDef.header, header.getContext())
                    }
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="border text-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={columns.length} 
                  className="h-24 text-center text-muted-foreground"
                >
                  No reviews found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.totalReviews)} of{" "}
            {pagination.totalReviews} results
          </p>

          <div className="flex items-center space-x-1">
            <Button 
              variant="outline" 
              className="h-8 w-8 p-0" 
              onClick={previousPage} 
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {getVisiblePages(pagination.page, pagination.totalPages).map((p, idx) => (
              p === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-sm">
                  ...
                </span>
              ) : (
                <Button 
                  key={p} 
                  className={
                    p === pagination.page 
                      ? "bg-[#6366F1] text-white hover:bg-[#6366F1]/90" 
                      : "bg-white text-black hover:bg-gray-100"
                  } 
                  size="sm" 
                  onClick={() => goToPage(p as number)}
                >
                  {p}
                </Button>
              )
            ))}
            
            <Button 
              variant="outline" 
              className="h-8 w-8 p-0" 
              onClick={nextPage} 
              disabled={pagination.page === pagination.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}