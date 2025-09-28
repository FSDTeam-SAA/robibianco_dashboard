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
import { Mail } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { forgatePassword } from "@/lib/auth/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


// 1️⃣ Define form schema - Only email needed for forgot password
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  // 2️⃣ Setup React Hook Form
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const router = useRouter();

  const sentotpMutation = useMutation({
    mutationKey: ["sentotp"],
    mutationFn: (email: string) => forgatePassword(email),
    onSuccess: (data, variables) => { 
      if (data.message === "User not found") {
        toast.error("User not found");
      } else {
        // Use the email from variables (the email that was submitted)
        router.push(`/auth/verify-otp?email=${encodeURIComponent(variables)}`);
        toast.success("OTP sent successfully!");
      }
    },
    onError: (error) => {
      console.error("Failed to send OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
    },
  });

  // Simplified form submission handler
  const onSubmit = (values: ForgotPasswordFormValues) => {
    sentotpMutation.mutate(values.email);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8">
        {/* Header */}
        <div className="text-start mb-8">
          <h1 className="text-lg font-medium text-[#000000] mb-2 leading-[120%]">
            Forgot Password
          </h1>
          <p className="text-[#B0B0B0] text-[16px] font-normal leading-[120%]">
            Enter your registered email address. We&apos;ll send you a code to
            reset your password.
          </p>
        </div>

        {/* Forgot Password Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[16px] font-normal text-[#000000] leading-[120%]">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#48A256] h-4 w-4" />
                      <Input
                        placeholder="Enter your email"
                        type="email"
                        {...field}
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Send OTP Button */}
            <Button
              type="submit"
              disabled={sentotpMutation.isPending}
              className="w-full mt-2 bg-[#48A256] hover:bg-[#4f975a] text-white cursor-pointer font-medium py-2.5 disabled:opacity-50"
            >
              {sentotpMutation.isPending ? "Sending..." : "Send OTP"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}