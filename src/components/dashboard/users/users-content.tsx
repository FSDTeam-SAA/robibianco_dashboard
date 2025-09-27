"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Star, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllUsers, useUserById } from "@/lib/hooks/useAllUsers";
// import { useUserById } from "@/lib/hooks/useUserById";
import { User } from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function UsersContent() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [filter, setFilter] = useState("all");

  // Modal state
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Fetch all users
  const { data, isLoading, error } = useAllUsers({
    filter,
    page,
    limit: pageSize,
  });

  // Fetch selected user details
  const {
    data: userDetail,
    isLoading: detailLoading,
    error: detailError,
  } = useUserById(selectedUserId!);

  console.log(userDetail)

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p>Error loading users.</p>;

  const users: User[] = data?.users || [];
  const totalPages = data?.totalPages || 1;

  // Handle "View Details"
  const handleViewDetails = (id: string) => {
    setSelectedUserId(id);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <div className="flex items-center space-x-3">
          <Select
            value={filter}
            onValueChange={(val) => {
              setFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] border border-[#6366F1]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="recent">Recent Users</SelectItem>
              <SelectItem value="week">Last Week Users</SelectItem>
              <SelectItem value="month">Last Month Users</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="flex items-center space-x-2 bg-transparent"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="text-center rounded-md overflow-hidden">
        <Table className="border-separate border-spacing-y-2">
          <TableHeader>
            <TableRow className="font-medium">
              <TableHead className="border text-center">User Name</TableHead>
              <TableHead className="border text-center">User Email</TableHead>
              <TableHead className="border text-center">Ratings</TableHead>
              <TableHead className="border text-center">Spins Time</TableHead>
              <TableHead className="text-center border">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user._id}
                className="hover:bg-gray-50 border rounded-lg"
              >
                <TableCell className="border">{user.fullName}</TableCell>
                <TableCell className="border">{user.email}</TableCell>
                <TableCell className="flex space-x-1 justify-center border">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-10 w-5 ${
                        i < (user.rating || 0)
                          ? "text-orange-400 fill-orange-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </TableCell>
                <TableCell className="border">
                  {user.totalSpins || 0} Tried <br />
                  <span>{user.totalRewards || 0} rewards</span>
                </TableCell>
                <TableCell className="text-center border">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#6366F1] cursor-pointer"
                    onClick={() => handleViewDetails(user._id)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Showing page {data?.page} of {totalPages} ({data?.totalUsers} users)
        </p>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            {"<"}
          </Button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              size="sm"
              variant={page === i + 1 ? "default" : "outline"}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            size="sm"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            {">"}
          </Button>
        </div>
      </div>

      {/* User Detail Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {detailLoading ? (
            <p>Loading...</p>
          ) : detailError ? (
            <p>Error loading user details</p>
          ) : userDetail ? (
            <div className="space-y-2 text-left">
              <p><strong>Name:</strong> {userDetail.fullName}</p>
              <p><strong>Email:</strong> {userDetail.email}</p>
              <p><strong>Phone:</strong> {userDetail.phone}</p>
              <p><strong>Role:</strong> {userDetail.role}</p>
              <p><strong>Status:</strong> {userDetail.status}</p>
              <p><strong>Total Spins:</strong> {userDetail.totalSpins}</p>
              <p><strong>Total Rewards:</strong> {userDetail.totalRewards}</p>
            </div>
          ) : (
            <p>No details found</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
