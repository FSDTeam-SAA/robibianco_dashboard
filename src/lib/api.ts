// API service layer with mock data

// api.ts
import { UserQuery } from "@/types/types";
import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// axios instance
const apiBase = axios.create({
  baseURL: API_BASE_URL,
});

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
