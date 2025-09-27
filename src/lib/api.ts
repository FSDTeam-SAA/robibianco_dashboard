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