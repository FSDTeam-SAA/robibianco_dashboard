import type { SpinResponse, ClaimResponse } from "@/types/reward";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function getSpinResult(id: string, accessToken?: string): Promise<SpinResponse> {
  if (!id) throw new Error("Spin ID is required");
  if (!accessToken) throw new Error("Access token is required");

  const response = await fetch(`${BASE_URL}/result/spin/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch spin result: ${response.statusText}`);
  }

  return response.json();
}

export async function claimSpinResult(id: string, accessToken?: string): Promise<ClaimResponse> {
  if (!id) throw new Error("Spin ID is required");
  if (!accessToken) throw new Error("Access token is required");

  const response = await fetch(`${BASE_URL}/result/spin/${id}/claim`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to claim spin result: ${response.statusText}`);
  }

  return response.json();
}

// Additional functions or updates can be added here if necessary
