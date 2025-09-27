import type { Metadata } from "next";
import "../globals.css";

import Sidebar from "@/components/dashboard/sidebar/Sidebar";
import Header from "@/components/dashboard/header/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex relative min-h-screen">
      <div className="w-[300px] fixed">
        <Sidebar />
      </div>
      <div className=" ml-[300px]">
        <div className="h-[104px]">

        <Header />
        </div>
        {children}
      </div>
    </div>
  );
}
