"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ Schema
const rewardSchema = z.object({
  rewardName: z.string().min(1, "Reward name is required"),
  stockLimit: z.coerce.number().min(1, "Stock limit is required"),
  couponCode: z.string().min(1, "Coupon code is required"),
  expiry: z.coerce.number().min(1, "Expiry is required"),
  description: z.string().min(1, "Description is required"),
  requireReview: z.boolean().default(false),
});

// ✅ Type inferred from schema
export type RewardFormData = z.infer<typeof rewardSchema>;

interface RewardFormProps {
  initialData?: Partial<RewardFormData>;
  onSubmit: (data: RewardFormData) => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function RewardForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: RewardFormProps) {
  const form = useForm({
    resolver: zodResolver(rewardSchema),
    defaultValues: {
      rewardName: initialData?.rewardName ?? "",
      stockLimit: initialData?.stockLimit ?? 0,
      couponCode: initialData?.couponCode ?? "",
      expiry: initialData?.expiry ?? 0,
      description: initialData?.description ?? "",
      requireReview: initialData?.requireReview ?? false,
    },
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {initialData ? "Edit Reward" : "Create New Reward"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* ✅ Pass generic <RewardFormData> so types match */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Reward Name */}
              <FormField
                control={form.control}
                name="rewardName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Reward Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Free Dessert" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Stock Limit */}
              <FormField
                control={form.control}
                name="stockLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Stock Limit <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100"
                        value={field.value?.toString() ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? 0 : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Coupon Code */}
              <FormField
                control={form.control}
                name="couponCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Coupon Code <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="DISCOUNT_10%" {...field} />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Customers will use this code to redeem their reward
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Expiry */}
              <FormField
                control={form.control}
                name="expiry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Expiry (days) <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="10"
                        value={field.value?.toString() ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? 0 : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Number of days the coupon is valid after being claimed
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter reward details"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Require Review */}
            <FormField
              control={form.control}
              name="requireReview"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Require review before claiming</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Customer must leave a review before they can claim this
                      reward.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 bg-transparent cursor-pointer"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-[#6366f1] hover:bg-[#6366f1]/90 text-white cursor-pointer"
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
