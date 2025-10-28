export interface DeviceInfo {
  userAgent: string;
}

export interface SpinResult {
  _id: string;
  rewardName: string;
  description: string;
  couponCode: string;
  stock: number;
  weight: number;
  expiryDays: number;
  isTryAgain: boolean;
  value: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Spin {
  _id: string;
  spinResult: SpinResult;
  uniqueCode: string;
  ipAddress: string;
  deviceInfo: DeviceInfo;
  fingerprint: string;
  status: "pending" | "claimed" | "expired";
  createdAt: string;
  updatedAt: string;
  expiryDays: number;
  __v: number;
}

export type SpinStatus = "pending" | "claimed" | "expired";

export interface SpinResponseData extends Spin {
  qrCode?: string;
  link?: string;
}

export interface APIResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export type SpinResponse = APIResponse<SpinResponseData>;
export type ClaimResponse = APIResponse<SpinResponseData | undefined>;
