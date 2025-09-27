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
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import Link from "next/link";

// 1️⃣ Define form schema
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function ForgotPassword() {
  // 2️⃣ Setup React Hook Form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    const res = await signIn("credentials", {
      redirect: true,
      email: values.email,
      password: values.password,
      callbackUrl: "/",
    });
    console.log(res);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  px-4">
      <div className="w-full max-w-md bg-white rounded-2xl  p-8">
        {/* Header */}
        <div className="text-start mb-8">
          <h1 className="text-lg font-medium text-[#000000] mb-2 leading-[120%] ">
            Forgot Password
          </h1>
            <p className="text-[#B0B0B0] text-[16px] font-normal leading-[120%]">
            Enter your registered email address. we’ll send you a code to reset your password.
          </p>
        </div>

        {/* Login Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
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
                        placeholder="Email"
                        {...field}
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

        

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full mt-2 bg-[#48A256] hover:bg-[#4f975a] text-white cursor-pointer font-medium py-2.5"
            >
              Sent OTP
            </Button>
          </form>
        </Form>


            
      </div>
    </div>
  );
}
