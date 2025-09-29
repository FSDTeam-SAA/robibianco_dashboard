"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  Gift,
  User,
  Settings,
  LogOut,
  // LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  {
    name: "Review Management",
    href: "/review-management",
    icon: MessageSquare,
  },
  { name: "Spin Wheel Rewards", href: "/rewards", icon: Gift },
  { name: "User", href: "/users", icon: User },
  { name: "Setting", href: "/settings", icon: Settings },
  { name: "Log Out", href: "/logout", icon: LogOut },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    // Here you can call your logout API or remove auth tokens
    // console.log("Logging out...");
    signOut({ callbackUrl: "/auth/signin" });
    router.push("/auth/signin");
  };

  return (
    <div className="flex h-full flex-col border-r bg-white">
      <div className="flex h-20 items-center px-8 ">
        <h1 className="text-3xl font-black text-[#6366f1] text-center">
          Dashboard
        </h1>
      </div>
      <nav className="flex-1 space-y-4 px-4 py-4">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          // For Log Out, we don't navigate directly
          if (item.name === "Log Out") {
            return (
              <button
                key={item.name}
                onClick={() => setShowLogoutModal(true)}
                className={cn(
                  "group flex w-full items-center justify-start rounded-lg border border-[#EEF2FF] px-4 py-4 text-lg font-medium transition-all relative",
                  "bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
                )}
              >
                <item.icon className="mr-3 h-5 w-5 text-gray-500" />
                {item.name}
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center justify-start rounded-lg border border-[#EEF2FF] px-4 py-4 text-lg font-medium transition-all relative",
                isActive
                  ? "bg-[#EEF0FF] text-[#6366F1] font-medium"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5",
                  isActive ? "text-[#6366F1]" : "text-gray-500"
                )}
              />
              {item.name}
              {isActive && (
                <span className="absolute right-0 top-0 h-full w-[3px] rounded-sm bg-[#6366F1]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-[#6366F1] text-white hover:bg-[#6366F1]  cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
