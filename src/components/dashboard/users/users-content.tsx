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
import { Download, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllUsers, useUserById } from "@/lib/hooks/useAllUsers";
import { User, Reward, UserApiResponse, UsersApiResponse } from "@/types/types";
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
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Paginated users
  const { data, isLoading, error } = useAllUsers({
    filter,
    page,
    limit: pageSize,
  });

  // Single user
  const { data: singleUser, isLoading: loadingSingle } = useUserById(
    selectedUserId as string
  );

  const users: User[] = (data as UsersApiResponse)?.users || [];
  const totalPages = (data as UsersApiResponse)?.totalPages || 1;

  // CSV Export function
  const handleExportCSV = () => {
    if (!users || users.length === 0) return;

    const headers = ["Name", "Email", "Rating", "Total Spins", "Total Rewards"];

    const rows = users.map((user) => [
      user.fullName,
      user.email,
      user.rating || 0,
      user.totalSpins || 0,
      user.totalRewards || 0,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-40 bg-red-50 border border-red-200 rounded-lg p-6 space-y-2">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="text-red-700 font-medium">Failed to load users.</p>
        <p className="text-red-500 text-sm">
          Please check your connection or try again later.
        </p>
      </div>
    );
  }

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
            className="flex items-center text-white cursor-pointer bg-[#6366F1] hover:bg-[#6366F1] hover:text-white "
            onClick={handleExportCSV}
          >
            <Download className="h-4 w-4" />
            <span>Export as .csv</span>
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
              {/* <TableHead className="border text-center">Ratings</TableHead> */}
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
                {/* <TableCell className="flex space-x-1 justify-center border">
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
                </TableCell> */}
                <TableCell className="border">
                  {user.totalSpins || 0} Tried <br />
                  <span>{user.totalRewards || 0} rewards</span>
                </TableCell>
                <TableCell className="text-center border">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#6366F1] cursor-pointer border-1 text-[#3C3C3C]"
                    onClick={() => setSelectedUserId(user._id)}
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
          {/* Previous Button */}
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="border-black text-black bg-white hover:bg-gray-100  cursor-pointer"
          >
            {"<"}
          </Button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              size="sm"
              variant={page === i + 1 ? "default" : "outline"}
              onClick={() => setPage(i + 1)}
              className={
                page === i + 1
                  ? "bg-[#6366F1] text-black border-black cursor-pointer hover:bg-[#6366F1]"
                  : "bg-white text-black border-black hover:bg-gray-100  cursor-pointer"
              }
            >
              {i + 1}
            </Button>
          ))}

          {/* Next Button */}
          <Button
            size="sm"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="border-black text-black bg-white hover:bg-gray-100  cursor-pointer"
          >
            {">"}
          </Button>
        </div>
      </div>

      {/* User Details Modal */}
      <Dialog
        open={!!selectedUserId}
        onOpenChange={() => setSelectedUserId(null)}
      >
        <DialogContent className="max-w-5xl h-[80vh] p-6 rounded-2xl shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#6366F1]">
              User Details
            </DialogTitle>
          </DialogHeader>

          {loadingSingle ? (
            <p className="text-center text-gray-500">Loading user details...</p>
          ) : (singleUser as UserApiResponse)?.data ? (
            <div className="space-y-8 overflow-y-auto pr-2 h-full">
              {/* Basic Info */}
              <div className="border rounded-xl p-6 bg-gray-50 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Basic Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p>
                    <strong>Name:</strong>{" "}
                    {(singleUser as UserApiResponse).data.user.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {(singleUser as UserApiResponse).data.user.email}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {(singleUser as UserApiResponse).data.user.phone}
                  </p>
                  <p>
                    <strong>Status:</strong>
                    <span
                      className={`ml-2 px-2 py-1 rounded text-white text-xs ${
                        (singleUser as UserApiResponse).data.user.status ===
                        "active"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {(singleUser as UserApiResponse).data.user.status}
                    </span>
                  </p>
                  <p>
                    <strong>Role:</strong>{" "}
                    {(singleUser as UserApiResponse).data.user.role}
                  </p>
                </div>
              </div>

              {/* Rewards */}
              <div className="border rounded-xl p-6 bg-gray-50 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Rewards
                </h3>
                {(singleUser as UserApiResponse).data.rewards.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {(singleUser as UserApiResponse).data.rewards.map(
                      (reward: Reward) => (
                        <div
                          key={reward._id}
                          className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-[#6366F1]">
                              {reward.spinResult?.rewardName || "Reward"}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                reward.rewardClaimedStatus === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : reward.rewardClaimedStatus === "claimed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {reward.rewardClaimedStatus}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            <strong>Prize Code:</strong> {reward.prizeCode}
                          </p>
                          <p className="text-sm text-gray-500 mb-2">
                            <strong>Rating:</strong>{" "}
                            {reward.rating ? `${reward.rating} ⭐` : "N/A"}
                          </p>
                          <p className="text-sm text-gray-600 italic">
                            {reward.comment || "No comment provided"}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No rewards found for this user.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No user details available.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
