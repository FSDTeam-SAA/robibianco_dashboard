

//forgot password

export const forgatePassword = async (email: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    // console.log(data)
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to forgate password");
    }
  }
};

export const verifyOTP = async (data: { email: string; otp: string }) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to verify user");
    }

    return result; 
  } catch (error) {
    console.error("Error in loginUser:", error);
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};

export const resetPassword = async (data: { email: string; newPassword: string;repeatNewPassword:string; }) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to verify user");
    }

    return result; 
  } catch (error) {
    console.error("Error in loginUser:", error);
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};
