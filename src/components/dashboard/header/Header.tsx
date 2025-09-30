"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserById } from "@/lib/hooks/useAllUsers";
import { useSession } from "next-auth/react";

export function Header() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: singleUser, isLoading: loadingSingle } = useUserById(
    userId as string
  );

  if (loadingSingle) {
    return (
      <header className="p-4 flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />

        <div className="flex flex-col space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </header>
    );
  }

  // Access the user object inside singleUser.data
  const user = singleUser?.data?.user;

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center space-x-4">
        {/* You can add logo or nav here */}
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            {/* You can replace with user.avatar if you have it */}
            <AvatarImage src="/user-avatar.jpg" />
            <AvatarFallback>
              {user?.fullName?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <div className="font-medium">{user?.fullName || "No Name"}</div>
            <div className="text-muted-foreground">
              {user?.email || "No Email"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
