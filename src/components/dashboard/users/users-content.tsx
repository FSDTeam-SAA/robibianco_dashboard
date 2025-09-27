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
// import { useAllUsers } from "@/lib/hooks/useAllUsers";

// Dummy Data
const users = [
  {
    id: 1,
    name: "Esther Howard",
    email: "Howard@gmail.com",
    reward: 5,
    spins: 3,
    rewards: 2,
    lastActive: "25/6/2025",
  },
  {
    id: 2,
    name: "Esther Howard",
    email: "Howard@gmail.com",
    reward: 4,
    spins: 3,
    rewards: 2,
    lastActive: "25/6/2025",
  },
  {
    id: 3,
    name: "Esther Howard",
    email: "Howard@gmail.com",
    reward: 3,
    spins: 3,
    rewards: 2,
    lastActive: "24/6/2025",
  },
  {
    id: 4,
    name: "Devon Lane",
    email: "Devon@gmail.com",
    reward: 5,
    spins: 3,
    rewards: 2,
    lastActive: "23/6/2025",
  },
  {
    id: 5,
    name: "Bessie Cooper",
    email: "Bessie@gmail.com",
    reward: 4,
    spins: 3,
    rewards: 2,
    lastActive: "24/6/2025",
  },
  {
    id: 6,
    name: "Floyd Miles",
    email: "Floyd@gmail.com",
    reward: 5,
    spins: 3,
    rewards: 2,
    lastActive: "23/6/2025",
  },
  {
    id: 7,
    name: "Floyd Miles",
    email: "Steward@gmail.com",
    reward: 3,
    spins: 3,
    rewards: 2,
    lastActive: "23/6/2025",
  },
  {
    id: 8,
    name: "Floyd Miles",
    email: "McKinney@gmail.com",
    reward: 2,
    spins: 3,
    rewards: 2,
    lastActive: "23/6/2025",
  },
  {
    id: 9,
    name: "Darrell Steward",
    email: "McKinney@gmail.com",
    reward: 4,
    spins: 3,
    rewards: 2,
    lastActive: "23/6/2025",
  },
  {
    id: 10,
    name: "Marvin McKinney",
    email: "McKinney@gmail.com",
    reward: 1,
    spins: 3,
    rewards: 2,
    lastActive: "23/6/2025",
  },
];

export function UsersContent() {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(users.length / pageSize);
  const [filter, setFilter] = useState("all");

  // const { data, isLoading, error } = useAllUsers({ filter: 'recent', page: 1, limit: 10 });

  // console.log(data)


  const startIndex = (page - 1) * pageSize;
  const currentUsers = users.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <div className="flex items-center space-x-3">
          {/* Filter Dropdown */}
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px] border border-[#6366F1]">
              {/* এখানে placeholder এর বদলে default value show করবে */}
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
        <Table className=" border-separate border-spacing-y-2 ">
          {" "}
          {/* row gap যোগ করা হলো */}
          <TableHeader>
            <TableRow className="font-medium">
              <TableHead className="border text-center">User Name</TableHead>
              <TableHead className="border text-center">User Email</TableHead>
              <TableHead className="border text-center">Reward</TableHead>
              <TableHead className="border text-center">Spins Time</TableHead>
              <TableHead className="border text-center">Last Active</TableHead>
              <TableHead className="text-center border">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-gray-50 border rounded-lg"
              >
                <TableCell className="border">{user.name}</TableCell>
                <TableCell className="border">{user.email}</TableCell>
                <TableCell className="flex space-x-1 justify-center border">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-10 w-5 ${
                        i < user.reward
                          ? "text-orange-400 fill-orange-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </TableCell>
                <TableCell className="border">
                  {user.spins} Tried <br />
                  <span className="">
                    {user.rewards} rewards
                  </span>
                </TableCell>
                <TableCell className="border">{user.lastActive}</TableCell>
                <TableCell className="text-center border ">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#6366F1] cursor-pointer"
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
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + pageSize, users.length)} of {users.length}{" "}
          results
        </p>
        <div className="flex items-center space-x-2 ">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="bg-[#6366F1]"
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
            className="bg-[#6366F1]"
          >
            {">"}
          </Button>
        </div>
      </div>
    </div>
  );
}
