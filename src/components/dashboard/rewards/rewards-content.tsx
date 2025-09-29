"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Reward } from "@/types/types";
import { useRewards } from "@/lib/hooks/use-reward";
import { RewardForm, RewardFormData } from "../forms/reward-form";
import { toast } from "sonner";
import { RewardsTable } from "./rewards-table";
import axios from "axios";
import { useSession } from "next-auth/react";
import { updateReward } from "@/lib/api";
// import { updateReward } from "@/lib/api";

export function RewardsContent() {
  const session = useSession();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);


  const {
    rewards,
    loading,
    pagination,
    goToPage,
    // changePageSize,
    createReward,
    refresh,
  } = useRewards();

  const handleCreateReward = () => {
    setEditingReward(null);
    setIsFormOpen(true);
  };

  const handleEditReward = (reward: Reward) => {
    setEditingReward(reward);
    setIsFormOpen(true);
    // console.log("This is edit", reward);
  };

  const handleFormSubmit = async (data: RewardFormData) => {
    try {
      if (!editingReward) {
        await createReward({
          rewardName: data.rewardName,
          description: data.description,
          couponCode: data.couponCode,
          stockLimit: data.stockLimit,
          expiryDays: data.expiry,
          requireReview: data.requireReview,
        });
        toast.success("Reward created successfully");
        setIsFormOpen(false);
        setEditingReward(null);
        // Refetch the latest rewards
        refresh();
      } else {
        // Updating existing reward
        await updateReward(editingReward.id, {
          rewardName: data.rewardName,
          description: data.description,
          couponCode: data.couponCode,
          stockLimit: data.stockLimit,
          expiryDays: data.expiry,
        });
        toast.success("Reward updated successfully");
        setIsFormOpen(false);
        setEditingReward(null);
        // Refresh the page
        refresh();
      }
    } catch (err) {
      console.error("Failed to save reward:", err);
      toast.error("Failed to save reward");
    }
  };

  const confirmDeleteReward = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/rewards/${deleteId}`,
        {
          headers: {
            Authorization: `Bearer ${session?.data?.user?.accessToken}`,
          },
        }
      );
      toast.success("Reward deleted successfully");
      location.reload();
    } catch (err) {
      console.error("Failed to delete reward:", err);
      toast.error("Failed to delete reward");
    } finally {
      setDeleteId(null);  
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Spin Wheel Rewards</h1>
        <Button
          onClick={handleCreateReward}
          className="bg-[#6366f1] hover:bg-[#6366f1]/90 text-white cursor-pointer"
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
        // onPageSizeChange={changePageSize}
        onEditReward={handleEditReward}
        onDeleteReward={(id) => setDeleteId(id)}
      />

      {/* Create / Edit Reward Form Modal */}
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

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this reward?</p>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              onClick={confirmDeleteReward}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
