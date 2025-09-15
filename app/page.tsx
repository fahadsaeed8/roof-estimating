// import Footer from "@/components/Footer";
// import Header from "@/components/Header";
// import HeroSection from "@/components/HeroSection";
// import React from "react";

// const Page = () => {
//   return (
//     <div>
//       <Header />
//       <HeroSection />
//       <Footer />
//     </div>
//   );
// };

// export default Page;

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, LogOut, LayoutDashboard, FileText, CreditCard, Briefcase, ClipboardPlus } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/customer-panel/dashboard", icon: LayoutDashboard },
  { name: "Proposals", href: "/customer-panel/proposal", icon: FileText },
  { name: "Payments", href: "/customer-panel/payment", icon: CreditCard },
  { name: "Job Progress", href: "/customer-panel/job-progress", icon: Briefcase },
  { name: "Request Estimate", href: "/customer-panel/request-estimate", icon: ClipboardPlus },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed z-20 inset-y-0 left-0 transform bg-white shadow-lg w-64 transition-transform duration-300 ease-in-out 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
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
            className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Navbar */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Open sidebar menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="font-semibold text-lg tracking-wide">Roof Estimate CRM</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">John Doe</span>
            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              className="w-10 h-10 rounded-full border shadow-sm"
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
