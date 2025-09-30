"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
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
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import type { Reward } from "@/types/types";

const columnHelper = createColumnHelper<Reward>();

interface RewardsPaginationMeta {
  page: number;
  limit: number;
  totalRewards: number;
  totalPages: number;
}

interface RewardsTableProps {
  rewards: Reward[];
  loading: boolean;
  pagination: RewardsPaginationMeta;
  onPageChange: (page: number) => void;
  onEditReward: (reward: Reward) => void;
  onDeleteReward: (id: string) => void;
}

export function RewardsTable({
  rewards,
  loading,
  pagination,
  onPageChange,
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
        const stock = info.getValue();

        return (
          <div className="space-y-2 min-w-[120px]">
            <div className="text-sm font-medium ">{stock}</div>
            {/* <Progress value={percentage} className="h-2" /> */}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      cell: (info) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onEditReward(info.row.original)}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4 cursor-pointer" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive cursor-pointer"
              onClick={() => onDeleteReward(info.row.original.id)}
            >
              <Trash2 className="mr-2 h-4 w-4 cursor-pointer" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ];

  const table = useReactTable({
    data: rewards,
    columns,
    getCoreRowModel: getCoreRowModel(),
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

    // Left ellipsis
    if (left > 2) pages.push("...");

    // Middle pages
    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    // Right ellipsis
    if (right < total - 1) pages.push("...");

    // Always include last page
    if (total > 1) pages.push(total);

    return pages;
  };

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
                    {flexRender(
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
                  No rewards found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
          {Math.min(
            pagination.page * pagination.limit,
            pagination.totalRewards
          )}{" "}
          of {pagination.totalRewards} results
        </p>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            <ChevronLeft />
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
                        ? "bg-[#6366F1] text-white border-black cursor-pointer hover:bg-[#6366F1]"
                        : "bg-white text-black border-black hover:bg-gray-100 cursor-pointer"
                    }
                    size="sm"
                    onClick={() => onPageChange(p as number)}
                  >
                    
                    {p}
                  </Button>
                )
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
