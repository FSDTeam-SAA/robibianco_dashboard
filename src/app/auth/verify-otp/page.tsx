"use client";
import React from "react";

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
import { useMutation } from "@tanstack/react-query";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner"; // or your preferred toast library
import { verifyOTP, forgatePassword } from "@/lib/auth/auth"; // Import forgatePassword

// 1️⃣ Define form schema
const otpSchema = z.object({
  otp: z
    .array(z.string().min(1, "Required").max(1, "Only one digit"))
    .length(6, "OTP must be 6 digits"),
});

type OtpFormValues = z.infer<typeof otpSchema>;

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // Get email from URL params

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: ["", "", "", "", "", ""],
    },
  });

  const otpMutation = useMutation({
    mutationKey: ["verifyotp"],
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      verifyOTP({ email, otp }),
    onSuccess: (data, variables) => {
      console.log("OTP verified successfully:", data);
      toast.success("OTP verified successfully!");

      // Fixed the router.push line - added missing ? and used variables.email
      router.push(
        `/auth/reset-password?email=${encodeURIComponent(variables.email)}`
      );
    },
    onError: (error: Error) => {
      console.error("OTP verification failed:", error);
      toast.error(error.message || "Failed to verify OTP");
    },
  });

  // Resend OTP Mutation
  const resendOtpMutation = useMutation({
    mutationKey: ["resendotp"],
    mutationFn: (email: string) => forgatePassword(email),
    onSuccess: (data, variables) => { 
      if (data.message === "User not found") {
        toast.error("User not found");
      } else {
        toast.success("OTP resent successfully!");
      }
    },
    onError: (error) => {
      console.error("Failed to resend OTP:", error);
      toast.error("Failed to resend OTP. Please try again.");
    },
  });

  const onSubmit = async (values: OtpFormValues) => {
    const otpCode = values.otp.join("");
    console.log("Entered OTP:", otpCode);

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      await otpMutation.mutateAsync({ email, otp: otpCode });
    } catch (error) {
      // Error is handled in onError callback
      console.error("Mutation error:", error);
    }
  };

  const handleResendOTP = () => {
    if (!email) {
      toast.error("Email is required to resend OTP");
      return;
    }

    resendOtpMutation.mutate(email);
  };

  // Auto-focus first input on mount
  React.useEffect(() => {
    const firstInput = document.querySelector<HTMLInputElement>(
      'input[name="otp.0"]'
    );
    firstInput?.focus();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            {/* Title */}
            <FormItem>
              <FormLabel className="text-[18px] text-center font-medium text-[#000000] leading-[120%] flex justify-center mb-[20px]">
                Enter OTP
              </FormLabel>
              {email && (
                <p className="text-center text-sm text-gray-600 mb-4">
                  Sent to: {email}
                </p>
              )}
            </FormItem>

            {/* OTP Inputs */}
            <div className="grid grid-cols-6 gap-2">
              {form.watch("otp").map((_, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={`otp.${index}` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          maxLength={1}
                          className="text-center text-lg"
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            field.onChange(value);

                            // Auto focus next input
                            if (value && index < 5) {
                              const next =
                                document.querySelector<HTMLInputElement>(
                                  `input[name="otp.${index + 1}"]`
                                );
                              next?.focus();
                            }

                            // Auto focus previous input on backspace
                            if (!value && index > 0) {
                              const prev =
                                document.querySelector<HTMLInputElement>(
                                  `input[name="otp.${index - 1}"]`
                                );
                              prev?.focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            // Handle backspace key
                            if (
                              e.key === "Backspace" &&
                              !field.value &&
                              index > 0
                            ) {
                              const prev =
                                document.querySelector<HTMLInputElement>(
                                  `input[name="otp.${index - 1}"]`
                                );
                              prev?.focus();
                            }
                          }}
                          onPaste={(e) => {
                            e.preventDefault();
                            const pasteData = e.clipboardData
                              .getData("text")
                              .replace(/\D/g, "") // only digits
                              .slice(0, 6); // max 6 digits

                            if (pasteData) {
                              const otpArray = pasteData.split("");
                              otpArray.forEach((digit, i) => {
                                form.setValue(`otp.${i}`, digit);
                              });

                              // focus last filled input
                              const lastIndex =
                                Math.min(otpArray.length, 6) - 1;
                              const lastInput =
                                document.querySelector<HTMLInputElement>(
                                  `input[name="otp.${lastIndex}"]`
                                );
                              lastInput?.focus();
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {/* Resend OTP Section */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Didn&apos;t Receive OTP?{" "}
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendOtpMutation.isPending}
                  className="text-[#48A256] hover:text-[#4f975a] cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendOtpMutation.isPending ? "Sending..." : "RESEND OTP"}
                </button>
              </p>
            </div>

            {/* Verify Button */}
            <Button
              type="submit"
              disabled={otpMutation.isPending}
              className="w-full mt-4 bg-[#48A256] hover:bg-[#4f975a] text-white cursor-pointer font-medium py-2.5 disabled:opacity-50"
            >
              {otpMutation.isPending ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;