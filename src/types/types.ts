export interface Reward {
  id: string;
  _id: string;
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
  spinResult: {
    _id: string;
    rewardName: string;
    description: string;
    couponCode: string;
  } | null;
  rating: number;
  comment: string;
  prizeCode: string;
  rewardClaimedStatus: string;
}

// In your types file (e.g., lib/types.ts)
// In @/types/types.ts
// export interface Review {
//   _id: string;
//   name: string;
//   email: string;
//   phone: string;
//   rating: number;
//   comment: string;
//   spinResult: {
//     _id: string;
//     rewardName: string;
//     description: string;
//     couponCode: string;
//   } | null;
//   prizeCode: string | null;
//   rewardClaimedStatus: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

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

export interface SpinResult {
  _id: string;
  rewardName: string;
  description: string;
  couponCode: string;
}

export interface Review {
  _id: string;
  name: string;
  email: string;
  phone: string;
  rating: number;
  comment: string;
  spinResult: SpinResult;
  prizeCode: string | null;
  rewardClaimedStatus: "pending" | "claimed" | "not_eligible";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalReviews: number;
  totalPages: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface ReviewsApiResponse extends ApiResponse {
  data: {
    reviews: Review[];
    page: number;
    limit: number;
    totalReviews: number;
    totalPages: number;
  };
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
