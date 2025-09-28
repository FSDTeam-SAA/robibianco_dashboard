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



export async function rewardsdata(page:number) {
  try {
    const res = await apiBase.get(`/rewards?page=${page}&limit=5`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Get Booking Error ${error.message}`);
    }
  }
}


export async function createRewardApi(data: {
  rewardName: string
  description: string
  couponCode: string
  stockLimit: number
  expiryDays: number
  requireReview?: boolean
}) {
  const res = await apiBase.post("/admin/rewards", data)
  return res.data
}



///////////
import type { ReviewsApiResponse, PaginationParams } from "@/types/types"

export async function fetchReviews(params: PaginationParams = { page: 1, limit: 10 }): Promise<ReviewsApiResponse> {
  const searchParams = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
  })

  const response = await apiBase.get(`/admin/reviews?${searchParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  // if (!response.ok) {
  //   throw new Error(`HTTP error! status: ${response.status}`)
  // }

  const data = await response.data

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch reviews")
  }

  return data
}

// export async function updateReviewStatus(id: string, status: "pending" | "claimed" | "not_eligible") {
//   const response = await apiBase.get(`/admin/reviews/${id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     data: { status },
//   })

//   // if (!response.ok) {
//   //   throw new Error(`HTTP error! status: ${response.status}`)
//   // }

//   const data = await response.json()

//   if (!data.success) {
//     throw new Error(data.message || "Failed to update review")
//   }

//   return data
// }
