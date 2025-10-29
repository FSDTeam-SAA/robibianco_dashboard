"use client";

import { useState, useEffect } from "react";
// import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, Gift, Hash } from "lucide-react";
import { toast } from "sonner";
import { SpinResponseData } from "@/types/reward";
import { claimSpinResult, getSpinResult } from "@/lib/reward";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function SpinResultPage() {
  const [spin, setSpin] = useState<SpinResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const { id } = useParams() as { id: string };
  const { data: session } = useSession();
  console.log("spain data 1", spin?.spinResult?.rewardName);
  const spinId = id;
  //   const accessToken = session?.user?.accessToken
  // console.log(session);
  const accessToken = session?.user?.accessToken; // This should come from your auth context

  useEffect(() => {
    if (!spinId) {
      setLoading(false);
      return;
    }

    async function fetchSpinResult() {
      try {
        const response = await getSpinResult(spinId, accessToken);
        setSpin(response.data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to fetch spin result"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSpinResult();
  }, [spinId, accessToken, toast]);

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const response = await claimSpinResult(spinId, accessToken);

      if (response.success) {
        toast.success("Spin result claimed successfully!");

        // Update the local state with the new data if available
        if (response.data) {
          setSpin(response.data);
        }
      }
    } catch (error) {
      toast.error(
        "Spin claim failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!spinId) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid Request</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              No spin ID provided in URL parameters.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!spin) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Spin Result Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Seems like the reward is already claimed!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log("Spin data:", spin);

  //   const { spin, qrCode } = spin
  console.log(spin);

  const expiryDate = new Date(spin?.createdAt);
  expiryDate.setDate(expiryDate.getDate() + spin?.expiryDays);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Gift className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl">Congratulations!</CardTitle>
          <CardDescription>
            You&apos;ve won a prize from the spin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="mb-2 text-xl font-bold text-primary">{spin?.rewardName}</h3>
            <p className="whitespace-pre-line text-sm text-muted-foreground">{spin?.description}</p>
          </div> */}

          {/* <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Coupon Code</span>
              <code className="rounded bg-background px-3 py-1 text-lg font-mono font-semibold">
                {spin?.couponCode}
              </code>
            </div>
          </div> */}

          {/* {qrCode && (
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-6">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <QrCode className="h-4 w-4" />
                <span>Scan to Redeem</span>
              </div>
              <div className="relative h-48 w-48">
                <Image
                  src={qrCode || "/placeholder.svg"}
                  alt="QR Code for redemption"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
          )} */}

          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
                <Hash className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Unique Code
                  </p>
                  <p className="font-mono text-sm font-semibold">
                    {spin?.uniqueCode}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
                <div className="mt-0.5 h-5 w-5 rounded-full bg-muted" />
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Status
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      spin?.status === "pending"
                        ? "text-yellow-600"
                        : spin?.status === "claimed"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {spin?.status.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            {/* <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
              <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Expires On</p>
                <p className="text-sm font-semibold">{expiryDate.toLocaleDateString()}</p>
              </div>
            </div> */}

            <div className="flex  items-start gap-3 rounded-lg border bg-card p-4">
              <div className="mt-0.5 h-5 w-5 rounded-full bg-muted" />
              <div className="space-y-1 flex flex-col w-full gap-2">
                <div className="flex  items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">
                    Reward Prize
                  </p>
                  <p className="text-sm font-semibold">
                    {spin?.spinResult?.rewardName}
                  </p>
                </div>
                <p className="text-sm  font-medium text-muted-foreground">
                  {spin?.spinResult?.description}
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleClaim}
            disabled={claiming || spin?.status !== "pending"}
            className="w-full"
            size="lg"
          >
            {claiming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Claiming...
              </>
            ) : spin?.status === "claimed" ? (
              "Already Claimed"
            ) : spin?.status === "expired" ? (
              "Expired"
            ) : (
              "Claim Prize"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Spin created on {new Date(spin?.createdAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
