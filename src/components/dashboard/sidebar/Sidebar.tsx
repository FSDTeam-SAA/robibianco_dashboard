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
    <div className="flex h-full w-64 flex-col bg-sidebar">
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-bold text-[#f97316]">Your Logo</h1>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#6366f1] text-white"
                  : "text-sidebar-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
