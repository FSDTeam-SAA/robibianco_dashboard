"use client";

import {  useState } from "react";
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
// import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useReviews } from "@/lib/hooks/use-reviews";
import type { Review } from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

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

export function ReviewsTable() {
  const { reviews, loading, error } = useReviews();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = [
    columnHelper.accessor("author_name", {
      header: "User Name",
      cell: (info) => {
        const row = info.row.original;
        // const ago = info.row.original;
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center h-full gap-3">
              <Image
                src={row?.profile_photo_url || ""}
                alt={info.getValue()}
                width={100}
                height={100}
                className="w-8 h-8 rounded-full object-cover border"
              />
              <div className="flex flex-col items-start">
                <span className="font-medium">{info.getValue() || "N/A"}</span>
                <div className="text-muted-foreground">
                  {row.relative_time_description || "N/A"}
                </div>
              </div>
            </div>
          </div>
        );
      },
    }),

    columnHelper.accessor("text", {
      header: "Comment",
      cell: (info) => (
        <div className="text-center">
          <p className="text-sm text-muted-foreground text-center  py-2 text-wrap">
            {info.getValue() || "No comment"}
          </p>
        </div>
      ),
    }),

    columnHelper.accessor("rating", {
      header: "Rating",
      cell: (info) => <StarRating rating={info.getValue() || 0} />,
    }),

    columnHelper.accessor("time", {
      header: "Date",
      cell: (info) => {
        const timestamp = info.getValue();
        const ts =
          typeof timestamp === "number" ? timestamp : Number(timestamp) || 0;
        const date = new Date(ts * 1000); // convert seconds → ms
        return <div>{date.toLocaleDateString("en-GB")}</div>;
      },
    }),
  ];

  // Normalize reviews into an array of Review before passing to react-table.
  const tableData: Review[] = Array.isArray(reviews)
    ? reviews
    : (() => {
        if (!reviews) return [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ("reviews" in reviews && Array.isArray((reviews as any).reviews)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (reviews as any).reviews as Review[];
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ("data" in reviews && Array.isArray((reviews as any).data)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (reviews as any).data as Review[];
        }
        return [];
      })();

  // const totalItems = tableData.length;
  // const totalPages = Math.ceil(totalItems / perPage);

  // const currentPageData = useMemo(() => {
  //   const startIndex = (currentPage - 1) * perPage;
  //   const endIndex = startIndex + perPage;
  //   return tableData.slice(startIndex, endIndex);
  // }, [tableData, currentPage, perPage]);

  // const goToPage = (page: number) => {
  //   setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  // };

  // const nextPage = () => {
  //   if (currentPage < totalPages) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };

  // const previousPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // };

  // // Fixed pagination rendering function
  // const renderPagination = () => {
  //   const pages: (number | string)[] = [];

  //   // Show first page always
  //   pages.push(1);

  //   // Determine the range of pages to show
  //   let startPage = Math.max(2, currentPage - 1);
  //   let endPage = Math.min(totalPages - 1, currentPage + 1);

  //   // Add ellipsis after first page if needed
  //   if (startPage > 2) {
  //     pages.push("...");
  //   }

  //   // Add pages in range
  //   for (let i = startPage; i <= endPage; i++) {
  //     pages.push(i);
  //   }

  //   // Add ellipsis before last page if needed
  //   if (endPage < totalPages - 1) {
  //     pages.push("...");
  //   }

  //   // Show last page (if more than 1 page total and not already included)
  //   if (totalPages > 1 && !pages.includes(totalPages)) {
  //     pages.push(totalPages);
  //   }

  //   return pages;
  // };

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: { sorting, columnFilters },
    manualPagination: true,
  });

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
      <TableRow
        key={hg.id}
        className="grid grid-cols-5" // 5 columns (User, Comment, Rating, Date = total columns)
      >
        {hg.headers.map((header) => (
          <TableHead
            key={header.id}
            className={`text-center ${
              header.column.id === "text" ? "col-span-2" : "col-span-1"
            }`}
          >
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
    {table.getRowModel().rows.length > 0 ? (
      table.getRowModel().rows.map((row) => (
        <TableRow
          key={row.id}
          className="grid grid-cols-5" // must match header grid
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell
              key={cell.id}
              className={`border h-auto text-center ${
                cell.column.id === "text" ? "col-span-2" : "col-span-1"
              }`}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))
    ) : (
      <TableRow className="grid grid-cols-5">
        <TableCell
          colSpan={columns.length}
          className="col-span-5 h-24 text-center text-muted-foreground"
        >
          No reviews found.
        </TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>

      </div>

      {/* Pagination */}
      {/* {totalPages > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            {(currentPage - 1) * perPage + 1} to{" "}
            {Math.min(
              currentPage * perPage,
              totalItems
            )}{" "}
            of {totalItems} results
          </p>

          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={previousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {renderPagination().map((p, idx) => {
              // Handle ellipsis
              if (typeof p === "string") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 py-1 text-sm text-gray-500 flex items-center select-none"
                  >
                    ...
                  </span>
                );
              }

              // Handle page numbers
              const isActive = p === currentPage;
              return (
                <Button
                  key={`page-${p}`}
                  variant="outline"
                  className={`min-w-8 h-8 px-3 transition-colors ${
                    isActive
                      ? "bg-[#6366F1] text-white border-[#6366F1] hover:bg-[#5558E3] hover:text-white"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  size="sm"
                  onClick={() => goToPage(p)}
                >
                  {p}
                </Button>
              );
            })}

            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )} */}
    </div>
  );
}
