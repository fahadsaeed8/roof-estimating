"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  LogOut,
  LayoutDashboard,
  FileText,
  CreditCard,
  Briefcase,
  ClipboardPlus,
} from "lucide-react";
import { handleLogout } from "@/utils/authHelper";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

const navItems = [
  {
    name: "Dashboard",
    href: "/customer-panel/dashboard",
    icon: LayoutDashboard,
  },
  { name: "Proposals", href: "/customer-panel/proposal", icon: FileText },
  { name: "Payments", href: "/customer-panel/payment", icon: CreditCard },
  {
    name: "Job Progress",
    href: "/customer-panel/job-progress",
    icon: Briefcase,
  },
  {
    name: "Request Estimate",
    href: "/customer-panel/request-estimate",
    icon: ClipboardPlus,
  },
];

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const queryClient = useQueryClient();

  const userProfile: any = queryClient.getQueryData(["profile"]);

  console.log("userProfile", userProfile);

  const handleLogoutFunction = () => {
    handleLogout();
    setSidebarOpen(false);
  };

  return (
    <div className="flex bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed z-30 inset-y-0 left-0 transform bg-white shadow-lg w-64 transition-transform duration-300 ease-in-out
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="h-16 flex items-center justify-center font-bold text-xl border-b bg-gradient-to-r from-green-600 to-teal-600 text-white">
          Customer Panel
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)} // ✅ close sidebar on mobile when link clicked
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200
                  ${
                    isActive
                      ? "bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-green-100"
                  }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={handleLogoutFunction}
            className="flex cursor-pointer items-center gap-2 w-full px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* ✅ Overlay (only on mobile when sidebar is open) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)} // ✅ close when clicking outside
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Navbar */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
          {/* Left section (Menu + Title) */}
          <div className="flex items-center gap-3">
            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Open sidebar menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            {/* Title */}
            <h1 className="font-semibold text-lg tracking-wide ">
              Roof Estimate CRM
            </h1>
          </div>

          {/* Right section (User info) */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">
                {userProfile?.first_name}
              </span>
              <span className="text-sm text-gray-600">
                {userProfile?.last_name}
              </span>
            </div>
            {userProfile?.profile_image ? (
              <Image
                src={userProfile?.profile_image}
                alt="profile"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-full border shadow-sm bg-blue-500 flex items-center justify-center">
                <span className="text-white font-semibold">
                  {userProfile?.first_name?.charAt(0)}
                  {userProfile?.last_name?.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
