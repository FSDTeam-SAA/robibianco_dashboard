"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  Gift,
  User,
  Settings,
  LogOut,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Review Management", href: "/review-management", icon: MessageSquare },
  { name: "Spin Wheel Rewards", href: "/rewards", icon: Gift },
  { name: "User", href: "/users", icon: User },
  { name: "Setting", href: "/settings", icon: Settings },
  { name: "Log Out", href: "/logout", icon: LogOut },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex h-full  flex-col border-r bg-white">
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-bold text-[#f97316]">Your Logo</h1>
      </div>
      <nav className="flex-1 space-y-4 px-4 py-4">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

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
                <span className="absolute right-0 top-0 h-full w-[3px] rounded-sm bg-[#6366F1]  " />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
