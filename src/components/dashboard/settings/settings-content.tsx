"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useChangePassword, useUserById } from "@/lib/hooks/useAllUsers";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export function SettingsContent() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Inline error for password mismatch
  const [passwordError, setPasswordError] = useState("");

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const changePasswordMutation = useChangePassword();
  const { mutate } = changePasswordMutation;

  const { data: singleUser, isLoading: loadingSingle } = useUserById(
    userId as string
  );

  const user = singleUser?.data?.user;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear password error as user types
    if (passwordError) setPasswordError("");
  };

  const handleSave = () => {
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match");
      return;
    }

    mutate(
      { currentPassword, newPassword, confirmPassword },
      {
        onSuccess: () => {
          // alert("Password changed successfully!");
          toast.success("Password changed successfully!")
          setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setPasswordError(""); 
        },
        onError: (err) => {
          setPasswordError(err?.message || "Failed to change password");
        },
      }
    );
  };

  if (loadingSingle) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#6366F1] rounded-full animate-spin"></div>
        <p className="text-gray-600 text-lg">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-gray-500">Edit your personal information</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="flex items-center space-x-4 py-6">
          <div className="h-20 w-20 rounded-full overflow-hidden border relative">
            <Image
              src={"/no-image.jpg"}
              alt={"Profile"}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-medium text-lg">
              {user?.fullName || "Loading..."}
            </h2>
            <p className="text-sm text-gray-500">{user?.role || ""}</p>
            <p className="text-sm text-gray-500">{user?.email || ""}</p>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Section */}
      <Card>
        <CardContent className="space-y-4 py-6">
          <h2 className="font-semibold text-lg">Change password</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Current Password</label>
              <Input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                placeholder="........."
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">New Password</label>
              <Input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                placeholder="........."
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Confirm New Password</label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                placeholder="........."
                onChange={handleChange}
              />
              {/* Show error below the confirm password input */}
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              className="bg-[#6366F1] cursor-pointer hover:bg-[#6366F1]"
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
