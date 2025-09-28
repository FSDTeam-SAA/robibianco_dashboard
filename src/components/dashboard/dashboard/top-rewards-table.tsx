"use client"

import { Star } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const topRewards = [
  {
    userName: "Esther Howard",
    userEmail: "Howard@gmail.com",
    contactNumber: "+1 (555) 234-5678",
    comment: "Delicious meals with excellent service. A perfect place for family and friend",
    reward: 5,
    date: "25/6/2025",
  },
  {
    userName: "Devon Lane",
    userEmail: "Devon @gmail.com",
    contactNumber: "+1 (555) 234-5678",
    comment: "A wonderful dining experience with delicious meals and warm hospitality",
    reward: 4,
    date: "25/6/2025",
  },
  {
    userName: "Bessie Cooper",
    userEmail: "Bessie@gmail.com",
    contactNumber: "+1 (555) 234-5678",
    comment: "Delicious meals with excellent service. A perfect place for family and friend",
    reward: 3,
    date: "24/6/2025",
  },
  {
    userName: "Floyd Miles",
    userEmail: "Floyd@gmail.com",
    contactNumber: "+1 (555) 234-5678",
    comment: "A wonderful dining experience with delicious meals and warm hospitality",
    reward: 3,
    date: "23/6/2025",
  },
  {
    userName: "Darrell Steward",
    userEmail: "Steward@gmail.com",
    contactNumber: "+44 20 7946 0123",
    comment: "Great place to enjoy good food and quality time with loved ones",
    reward: 3,
    date: "24/6/2025",
  },
  {
    userName: "Marvin McKinney",
    userEmail: "McKinney@gmail.com",
    contactNumber: "+44 20 7946 0123",
    comment: "Tasty dishes with top-notch service, perfect for all occasions",
    reward: 2,
    date: "23/6/2025",
  },
]

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

export function TopRewardsTable() {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Name</TableHead>
            <TableHead>User Email</TableHead>
            <TableHead>Contact Number</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Reward</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topRewards.map((reward, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{reward.userName}</TableCell>
              <TableCell>{reward.userEmail}</TableCell>
              <TableCell>{reward.contactNumber}</TableCell>
              <TableCell className="max-w-xs">
                <p className="text-sm text-muted-foreground truncate">{reward.comment}</p>
              </TableCell>
              <TableCell>
                <StarRating rating={reward.reward} />
              </TableCell>
              <TableCell>{reward.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Showing 1 to 5 of 10 results</p>
        {/* <Pagination currentPage={1} totalPages={2} /> */}
      </div>
    </div>
  )
}
