export interface Reward {
  id: string
  rewardName: string
  description: string
  couponCode: string
  expiry: string
  date: string
  stock: number
  maxStock: number
  requireReview: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id: string
  userName: string
  userEmail: string
  contactNumber: string
  comment: string
  rating: number
  date: string
  rewardId?: string
  status: "pending" | "approved" | "rejected"
  createdAt: Date
}

export interface User {
  id: string
  name: string
  email: string
  contactNumber: string
  totalSpins: number
  totalRewards: number
  joinDate: string
  status: "active" | "inactive"
}

export interface DashboardStats {
  totalSpins: number
  totalRewards: number
  totalUsers: number
  totalReviews: number
  positiveReviews: number
  negativeReviews: number
  spinsOverTime: Array<{
    day: string
    spins: number
  }>
}

export interface UserQuery {
  filter?: string;
  page?: number;
  limit?: number;
}
