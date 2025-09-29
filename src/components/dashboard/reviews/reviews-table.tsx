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

// ⭐ Reusable star rating component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex space-x-1">
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
  setReviewData: React.Dispatch<React.SetStateAction<Review[]>>;
}

export function ReviewsTable({ timeFilter }: ReviewsTableProps) {
  const {
    reviews,
    loading,
    error,
    pagination,
    goToPage,
    nextPage,
    previousPage,
  } = useReviews(timeFilter);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Keep parent state updated with reviews
  // useEffect(() => {
  //   setReviewData(reviews);
  // }, [reviews, setReviewData]);

  const columns = [
    columnHelper.accessor("name", {
      header: "User Name",
      cell: (info) => <div className="font-medium">{info.getValue()}</div>,
    }),
    columnHelper.accessor("email", {
      header: "User Email",
      cell: (info) => (
        <div className="text-muted-foreground">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor("phone", {
      header: "Contact Number",
      cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("comment", {
      header: "Comment",
      cell: (info) => (
        <div className="max-w-xs">
          <p className="text-sm text-muted-foreground py-2 line-clamp-2">
            {info.getValue()}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("rating", {
      header: "Rating",
      cell: (info) => <StarRating rating={info.getValue()} />,
    }),
    columnHelper.accessor("createdAt", {
      header: "Date",
      cell: (info) => (
        <div>{new Date(info.getValue()).toLocaleDateString("en-GB")}</div>
      ),
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
    manualPagination: true, // pagination controlled by hook
    pageCount: pagination.totalPages,
  });

  if (loading) {
    return (
      <div className="space-y-2 flex flex-col  justify-center items-center">
        {/* Skeleton for table header */}
        <div className="flex space-x-4">
          <Skeleton className="h-6 w-32 rounded-md" />
          <Skeleton className="h-6 w-32 rounded-md" />
          <Skeleton className="h-6 w-32 rounded-md" />
          <Skeleton className="h-6 w-32 rounded-md" />
        </div>

        {/* Skeleton rows */}
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="flex space-x-4 mt-2">
            <Skeleton className="h-6 w-32 rounded-md" />
            <Skeleton className="h-6 w-32 rounded-md" />
            <Skeleton className="h-6 w-32 rounded-md" />
            <Skeleton className="h-6 w-32 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }
  const getVisiblePages = (
    current: number,
    total: number,
    delta = 2
  ): (number | string)[] => {
    const pages: (number | string)[] = [];
    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);

    // Always include first page
    pages.push(1);

    // Add left ellipsis if needed
    if (left > 2) {
      pages.push("...");
    }

    // Add middle pages
    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    // Add right ellipsis if needed
    if (right < total - 1) {
      pages.push("...");
    }

    // Always include last page (if > 1)
    if (total > 1) {
      pages.push(total);
    }

    return pages;
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="text-center">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="border">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No reviews found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
          {Math.min(
            pagination.page * pagination.limit,
            pagination.totalReviews
          )}{" "}
          of {pagination.totalReviews} results
        </p>

        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            className="h-8 w-8 p-0 bg-transparent"
            onClick={previousPage}
            disabled={pagination.page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
         <div className="flex items-center space-x-1">
            {getVisiblePages(pagination.page, pagination.totalPages).map(
              (p, idx) =>
                p === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-2">
                    ...
                  </span>
                ) : (
                  <Button
                    key={p}
                    className={
                      p === pagination.page
                        ? "bg-[#6366F1] text-black border-black cursor-pointer hover:bg-[#6366F1]"
                        : "bg-white text-black border-black hover:bg-gray-100 cursor-pointer"
                    }
                    size="sm"
                    onClick={() => goToPage(p as number)}
                  >
                    {p}
                  </Button>
                )
            )}
          </div>


          <Button
            variant="outline"
            className="h-8 w-8 p-0 bg-transparent"
            onClick={nextPage}
            disabled={pagination.page === pagination.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
