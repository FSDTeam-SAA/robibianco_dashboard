// API service layer with mock data
 
import { UserQuery } from "@/types/types";
import axios from "axios";
 
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL;

// Create axios instance
const apiBase = axios.create({
  baseURL: API_BASE_URL,
});



// get all Users dynamically
export async function getAllUsers({ filter = "all", page = 1, limit = 10 }: UserQuery) {
  try {
    const res = await apiBase.get(`/admin/users`, {
      params: { filter, page, limit },
    });
    return res.data;
  } catch {
    throw new Error(`Failed to fetch Users`);
  }
}