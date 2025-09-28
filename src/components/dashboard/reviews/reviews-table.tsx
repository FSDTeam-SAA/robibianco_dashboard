"use client";

import { useState, useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useReviews } from "@/lib/hooks/use-reviews";
import type { Review } from "@/types/types";

const columnHelper = createColumnHelper<Review>();

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

// function RewardStatus({
//   status,
//   spinResult,
//   prizeCode,
// }: {
//   status: string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   spinResult: any;
//   prizeCode: string | null;
// }) {
//   if (status === "not_eligible") {
//     return <span className="text-muted-foreground">Not Eligible</span>;
//   }

//   if (spinResult && prizeCode) {
//     return (
//       <div className="space-y-1">
//         <div className="font-medium">{spinResult.rewardName}</div>
//         <div className="text-xs text-muted-foreground">Code: {prizeCode}</div>
//         <span
//           className={`px-2 py-1 rounded-full text-xs ${
//             status === "claimed"
//               ? "bg-green-100 text-green-800"
//               : "bg-yellow-100 text-yellow-800"
//           }`}
//         >
//           {status === "claimed" ? "Claimed" : "Pending"}
//         </span>
//       </div>
//     );
//   }

//   return <span className="text-muted-foreground">No reward</span>;
// }

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
    previousPage,
    changePageSize,
  } = useReviews();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Filter reviews based on time filter (client-side filtering for current page)
  const filteredReviews = useMemo(() => {
    if (timeFilter === "all") return reviews;

    const now = new Date();
    const filterDate = new Date();

    switch (timeFilter) {
      case "today":
        filterDate.setHours(0, 0, 0, 0);
        break;
      case "lastWeek":
        filterDate.setDate(now.getDate() - 7);
        break;
      case "lastMonth":
        filterDate.setMonth(now.getMonth() - 1);
        break;
      default:
        return reviews;
    }

    return reviews.filter((review) => {
      const reviewDate = new Date(review.createdAt);
      return reviewDate >= filterDate;
    });
  }, [reviews, timeFilter]);

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
      header: "Reward",
      cell: (info) => <StarRating rating={info.getValue()} />,
    }),
    // columnHelper.accessor("rewardClaimedStatus", {
    //   header: "Reward",
    //   cell: (info) => (
    //     <RewardStatus
    //       status={info.getValue()}
    //       spinResult={info.row.original.spinResult}
    //       prizeCode={info.row.original.prizeCode}
    //     />
    //   ),
    // }),
    columnHelper.accessor("createdAt", {
      header: "Date",
      cell: (info) => (
        <div>{new Date(info.getValue()).toLocaleDateString()}</div>
      ),
    }),
  ];

  const table = useReactTable({
    data: filteredReviews,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
    manualPagination: true, // Enable manual pagination for server-side control
    pageCount: pagination.totalPages,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading reviews...</div>
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

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(
              pagination.page * pagination.limit,
              pagination.totalReviews
            )}{" "}
            of {pagination.totalReviews} results
            {timeFilter !== "all" &&
              ` (filtered from ${reviews.length} total reviews)`}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={pagination.limit.toString()}
              onValueChange={(value) => changePageSize(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pagination.limit} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
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
              <Button
                variant="outline"
                className="h-8 w-8 p-0 bg-transparent"
                onClick={() => goToPage(1)}
                disabled={pagination.page === 1}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0 bg-transparent"
                onClick={previousPage}
                disabled={pagination.page === 1}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0 bg-transparent"
                onClick={nextPage}
                disabled={pagination.page === pagination.totalPages}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0 bg-transparent"
                onClick={() => goToPage(pagination.totalPages)}
                disabled={pagination.page === pagination.totalPages}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
