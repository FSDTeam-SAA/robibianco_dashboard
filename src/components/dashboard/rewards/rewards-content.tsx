"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Reward } from "@/types/types";
import { useRewards } from "@/lib/hooks/use-reward";
import { RewardForm, RewardFormData } from "../forms/reward-form";
import { toast } from "sonner";
import { RewardsTable } from "./rewards-table";
import axios from "axios";
import { useSession } from "next-auth/react";

export function RewardsContent() {
  const session = useSession();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const {
    rewards,
    loading,
    pagination,
    goToPage,
    changePageSize,
    createReward,
    // updateReward,
    // deleteReward,
  } = useRewards();

  const handleCreateReward = () => {
    setEditingReward(null);
    setIsFormOpen(true);
  };

  const handleEditReward = (reward: Reward) => {
    setEditingReward(reward);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: RewardFormData) => {
    try {
      {
        // Create new reward
        await createReward({
          rewardName: data.rewardName,
          description: data.description,
          couponCode: data.couponCode,
          stockLimit: data.stockLimit,
          expiryDays: data.expiry,
          requireReview: data.requireReview,
        });
        toast("Reward created successfully");
      }
      setIsFormOpen(false);
      setEditingReward(null);
    } catch (err) {
      console.error("Failed to save reward:", err);
      toast("Failed to save reward");
    }
  };

  const handleDeleteReward = async (id: string) => {
    if (confirm("Are you sure you want to delete this reward?")) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/rewards/${id}`,
          {
            headers: {
              Authorization: `Bearer ${session?.data?.user?.accessToken}`,
            },
          }
        );

        toast.success("Reward deleted successfully");
        location.reload();
        // Optionally refresh the rewards list here
      } catch (err) {
        console.error("Failed to delete reward:", err);
        toast.error("Failed to delete reward");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Spin Wheel Rewards</h1>
        <Button
          onClick={handleCreateReward}
          className="bg-[#6366f1] hover:bg-[#6366f1]/90 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Reward
        </Button>
      </div>

      <RewardsTable
        rewards={rewards}
        loading={loading}
        pagination={pagination}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
        onEditReward={handleEditReward}
        onDeleteReward={handleDeleteReward}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingReward ? "Edit Reward" : "Create New Reward"}
            </DialogTitle>
          </DialogHeader>
          <RewardForm
            initialData={
              editingReward
                ? {
                    rewardName: editingReward.rewardName,
                    stockLimit: editingReward.maxStock,
                    couponCode: editingReward.couponCode,
                    expiry:
                      typeof editingReward.expiry === "string"
                        ? Number(editingReward.expiry)
                        : editingReward.expiry,
                    description: editingReward.description,
                    requireReview: editingReward.requireReview,
                  }
                : undefined
            }
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={loading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
