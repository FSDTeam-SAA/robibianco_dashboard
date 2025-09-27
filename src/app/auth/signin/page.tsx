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

// 1️⃣ Define form schema
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function SignInPage() {
  // 2️⃣ Setup React Hook Form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    // Use NextAuth credentials (or OAuth) login
    const res = await signIn("credentials", {
      redirect: true,
      email: values.email,
      password: values.password,
      callbackUrl: "/",
    });

    console.log(res);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold mb-2">Login To Your Account</h1>
      <p className="mb-6 text-center text-muted-foreground">
        Please enter your email and password to continue
      </p>

     
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-80"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="mt-2">
            Sign In
          </Button>
        </form>
      </Form>

      {/* Google OAuth login */}
      <Button
        variant="outline"
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="mt-4 w-80"
      >
        Sign in with Google
      </Button>
    </div>
  );
}
