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
import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Fix: Wait for component to mount before using router
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();

  const onSubmit = async (values: LoginFormValues) => {
    if (!isMounted) return;
    
    setIsLoading(true);
    setError(null);
    
    console.log("🚀 Login attempt with:", values.email);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl: "/",
      });

      console.log("📨 SignIn response:", result);

      if (result?.error) {
        let errorMessage = "Login failed. Please check your credentials.";
        
        if (result.error === "CredentialsSignin") {
          errorMessage = "Invalid email or password.";
        } else if (result.error.includes("401") || result.error.includes("Unauthorized")) {
          errorMessage = "Invalid email or password.";
        } else if (result.error.includes("Network") || result.error.includes("fetch")) {
          errorMessage = "Network error. Please check your connection.";
        }
        
        setError(errorMessage);
        console.error("❌ Login error:", result.error);
      } else if (result?.ok) {
        console.log("✅ Login successful, redirecting to home");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("❌ Unexpected error during login:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

 

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 ">
      <div className="w-full max-w-md bg-white rounded-2xl  p-8">
        <div className="text-start mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Login To Your Account
          </h1>
          <p className="text-gray-600 text-sm">
            Please enter your email and password to continue
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 h-4 w-4" />
                      <Input 
                        placeholder="Enter your email" 
                        {...field} 
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 h-4 w-4" />
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <div className="flex justify-end items-center mt-2">
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-green-600 hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white py-2.5 transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>

      </div>
    </div>
  );
}