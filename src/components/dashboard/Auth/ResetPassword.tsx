"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/lib/auth/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner"; // or your preferred toast library

// 1️⃣ Define form schema
const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // Get email from URL params

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = useMutation({
    mutationKey: ["resetPassword"],
    mutationFn: (data: { email: string; newPassword: string; repeatNewPassword: string }) => 
      resetPassword(data),
    onSuccess: (data) => {
      console.log("Password reset successfully:", data);
      toast.success("Password reset successfully!");
      
      // Redirect to login page after successful reset
      router.push("/login");
    },
    onError: (error: Error) => {
      console.error("Password reset failed:", error);
      toast.error(error.message || "Failed to reset password");
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    // Prepare data according to your API requirements
    const resetData = {
      email: email,
      newPassword: values.newPassword,
      repeatNewPassword: values.confirmPassword // Using confirmPassword as repeatNewPassword
    };

    console.log("Reset data:", resetData);
    
    try {
      await resetPasswordMutation.mutateAsync(resetData);
    } catch (error) {
      // Error is handled in onError callback
      console.error("Mutation error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-lg font-medium text-[#000000] mb-2 leading-[120%]">
            Reset Password
          </h1>
          {email && (
            <p className="text-sm text-gray-600">
              Resetting password for: {email}
            </p>
          )}
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            {/* New Password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[16px] font-normal text-[#000000] leading-[120%]">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#48A256] h-4 w-4" />
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        {...field}
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[16px] font-normal text-[#000000] leading-[120%]">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#48A256] h-4 w-4" />
                      <Input
                        type="password"
                        placeholder="Confirm password"
                        {...field}
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={resetPasswordMutation.isPending}
              className="w-full mt-2 bg-[#48A256] hover:bg-[#4f975a] text-white cursor-pointer font-medium py-2.5 disabled:opacity-50"
            >
              {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;