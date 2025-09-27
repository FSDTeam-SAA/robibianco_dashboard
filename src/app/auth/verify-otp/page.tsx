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

// 1️⃣ Define form schema
const otpSchema = z.object({
  otp: z
    .array(z.string().min(1, "Required").max(1, "Only one digit"))
    .length(6, "OTP must be 6 digits"),
});

type OtpFormValues = z.infer<typeof otpSchema>;

const Page = () => {
  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: ["", "", "", "", "", ""],
    },
  });

  const onSubmit = async (values: OtpFormValues) => {
    const otpCode = values.otp.join("");
    console.log("Entered OTP:", otpCode);

    // TODO: Call your verify API here
    // await verifyOtpApi(otpCode)
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow">
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
                              const next = document.querySelector<HTMLInputElement>(
                                `input[name="otp.${index + 1}"]`
                              );
                              next?.focus();
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

            {/* Verify Button */}
            <Button
              type="submit"
              className="w-full mt-4 bg-[#48A256] hover:bg-[#4f975a] text-white cursor-pointer font-medium py-2.5"
            >
              Verify
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
