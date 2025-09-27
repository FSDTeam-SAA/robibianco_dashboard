"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"


import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import type { Reward } from "@/lib/types"
import { useRewards } from "@/lib/hooks/use-reward"
import { RewardsTable } from "./reviews-table"
import { RewardForm } from "../forms/reward-form"

export function RewardsContent() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingReward, setEditingReward] = useState<Reward | null>(null)
  const { rewards, loading, createReward, updateReward, deleteReward } = useRewards()

  const handleCreateReward = () => {
    setEditingReward(null)
    setIsFormOpen(true)
  }

  const handleEditReward = (reward: Reward) => {
    setEditingReward(reward)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingReward) {
        await updateReward(editingReward.id, data)
      } else {
        await createReward({
          ...data,
          stock: Number.parseInt(data.stockLimit),
          maxStock: Number.parseInt(data.stockLimit),
          date: new Date().toLocaleDateString("en-GB"),
        })
      }
      setIsFormOpen(false)
      setEditingReward(null)
    } catch (error) {
      console.error("Failed to save reward:", error)
    }
  }

  const handleFormCancel = () => {
    setIsFormOpen(false)
    setEditingReward(null)
  }

  const handleDeleteReward = async (id: string) => {
    try {
      await deleteReward(id)
    } catch (error) {
      console.error("Failed to delete reward:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Spin Wheel Rewards</h1>
        <Button onClick={handleCreateReward} className="bg-[#6366f1] hover:bg-[#6366f1]/90 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Create New Reward
        </Button>
      </div>

      <RewardsTable
        rewards={rewards}
        loading={loading}
        onEditReward={handleEditReward}
        onDeleteReward={handleDeleteReward}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingReward ? "Edit Reward" : "Create New Reward"}</DialogTitle>
          </DialogHeader>
          <RewardForm
            initialData={
              editingReward
                ? {
                    rewardName: editingReward.rewardName,
                    stockLimit: editingReward.maxStock.toString(),
                    couponCode: editingReward.couponCode,
                    expiry: editingReward.expiry,
                    description: editingReward.description,
                    requireReview: editingReward.requireReview,
                  }
                : undefined
            }
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={loading}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
