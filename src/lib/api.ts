// API service layer with mock data

// api.ts
import { UserQuery } from "@/types/types";
import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import { getSession } from "next-auth/react";
// axios instance
const apiBase = axios.create({
  baseURL: API_BASE_URL,
});

apiBase.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.user.accessToken) {
      config.headers.Authorization = `Bearer ${session.user.accessToken}`;
    } else {
      console.warn("No token in session");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// get all Users dynamically with token
export async function getAllUsers(
  { filter = "all", page = 1, limit = 10 }: UserQuery,
  token: string
) {
  try {
    const res = await apiBase.get(
      `/admin/users?filter=${filter}&page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data.data;
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch Users`);
  }
}

// Get single user by ID
export async function getUserById(userId: string, token: string) {
  try {
    const res = await apiBase.get(`/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch user`);
  }
}

//reviwed

export async function review() {
  try {
    const res = await apiBase.get(`/admin/reviews`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Get Booking Error ${error.message}`);
    }
  }
}

export async function rewardsdata(page: number,limit: number) {
  try {
    const res = await apiBase.get(`/rewards?page=${page}&limit=${limit}`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Get Booking Error ${error.message}`);
    }
  }
}

export async function createRewardApi(data: {
  rewardName: string;
  description: string;
  couponCode: string;
  stockLimit: number;
  expiryDays: number;
  requireReview?: boolean;
}) {
  const res = await apiBase.post("/admin/rewards", data);
  return res.data;
}

///////////
import type {
  ReviewsApiResponse,
  PaginationParams,
  RewardUpdatePayload,
} from "@/types/types";

export async function fetchReviews(
  params: PaginationParams & { timeFilter?: string } = {
    page: 1,
    limit: 10,
    searchQuery: "",
  }
): Promise<ReviewsApiResponse> {
  const searchParams = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
  });

  // Add filter parameter for time filtering
  if (params.timeFilter && params.timeFilter !== "all") {
    searchParams.append("filter", params.timeFilter);
  }
  // For "all", don't send any filter parameter

  console.log("🔗 Making API call to:", `/admin/reviews?${searchParams.toString()}`);

  const response = await apiBase.get(`/admin/reviews?${searchParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  const data = await response.data;

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch reviews");
  }

  return data;
}

// export async function updateReward(id: string, rewardData: RewardUpdatePayload) {
//   const response = await apiBase.patch(`/admin/rewards/${id}`, {
//     // method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     data: { rewardData },
//   });
//   const data = await response.data;
//   if (!data.success) {
//     throw new Error(data.message || "Failed to update review");
//   }
//   return data;
// }
export async function updateReward(
  id: string,
  rewardData: RewardUpdatePayload
) {
  const response = await apiBase.patch(`/admin/rewards/${id}`, rewardData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = response.data;
  if (!data.success) {
    throw new Error(data.message || "Failed to update reward");
  }
  return data;
}

// Change Password
export async function changePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
  token: string
) {
  try {
    const res = await apiBase.patch(
      `/user/change-password`,
      {
        currentPassword,
        newPassword,
        confirmPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to change password`);
  }
}

// Fetch spins over time from dashboard analytics
export async function getSpinsOverTime({ filter }: UserQuery, token: string) {
  try {
    const res = await apiBase.get(`/admin/analytics/spins-over-time`, {
      params: { filter },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Ensure data exists before returning
    if (res.data && res.data.data) {
      return res.data.data;
    } else {
      throw new Error("No data returned from spins-over-time API");
    }
  } catch (err) {
    console.error("Error fetching spins over time:", err);
    throw new Error("Failed to fetch spins analytics");
  }
}

//  get review-distribution
export async function geTreviewDistribution(
  { filter }: UserQuery,
  token: string
) {
  try {
    const res = await apiBase.get(`/admin/analytics/review-distribution`, {
      params: { filter },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Ensure data exists before returning
    if (res.data && res.data.data) {
      return res.data.data;
    } else {
      throw new Error("No data returned from review-distribution API");
    }
  } catch (err) {
    console.error("Error fetching review distribution", err);
    throw new Error("Failed to fetch review distribution");
  }
}

// admin analytics top-rewards-claimed
// admin analytics top-rewards-claimed
export async function getTopRewardsClaimed(
  { filter, page, limit }: { filter?: string; page?: number; limit?: number },
  token: string
) {
  try {
    const res = await apiBase.get(`/admin/analytics/top-rewards-claimed`, {
      params: { filter, page, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data && res.data.data) {
      return res.data;
    } else {
      throw new Error("No data returned from top-rewards-claimed API");
    }
  } catch (err) {
    console.error("Error fetching top-rewards-claimed", err);
    throw new Error("Failed to fetch top-rewards-claimed data");
  }
}
