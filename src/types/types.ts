export interface Reward {
  id: string;
  rewardName: string;
  description: string;
  couponCode: string;
  expiry: string;
  date: string;
  stock: number;
  maxStock: number;
  requireReview: boolean;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
  prizeCode: string;
  rewardClaimedStatus: "pending" | "claimed" | "expired";
  rating?: number;
  comment?: string;
  spinResult?: {
    rewardName?: string;
  };
}

export interface Review {
  id: string;
  userName: string;
  userEmail: string;
  contactNumber: string;
  comment: string;
  rating: number;
  date: string;
  rewardId?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  status: "active" | "inactive" | "banned";
  role: "user" | "admin" | "superadmin";
  isEmailVerified: boolean;
  rating?: number;
  totalSpins?: number;
  totalRewards?: number;
}

export interface DashboardStats {
  totalSpins: number;
  totalRewards: number;
  totalUsers: number;
  totalReviews: number;
  positiveReviews: number;
  negativeReviews: number;
  spinsOverTime: Array<{
    day: string;
    spins: number;
  }>;
}

export interface UserQuery {
  filter?: string;
  page?: number;
  limit?: number;
}

export interface UsersApiResponse {
  users: User[];
  page: number;
  totalPages: number;
  totalUsers: number;
}

export interface UserApiResponse {
  data: {
    user: User;
    rewards: Reward[];
  };
}