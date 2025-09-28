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

// 1️⃣ Define form schema
const loginSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Page = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    // Example: call reset API, here just log values
    console.log("Reset values:", values);

    // If you want to sign in directly:
    // await signIn("credentials", {
    //   redirect: true,
    //   email: userEmail, // <-- pass the email from context or params
    //   password: values.newPassword,
    //   callbackUrl: "/",
    // });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-lg font-medium text-[#000000] mb-2 leading-[120%]">
            Reset Password
          </h1>
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
              className="w-full mt-2 bg-[#48A256] hover:bg-[#4f975a] text-white cursor-pointer font-medium py-2.5"
            >
              Continue
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
