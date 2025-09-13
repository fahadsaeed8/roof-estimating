"use client";
import React from "react";
import Link from "next/link";
import { LayoutDashboard, User, FileText, BarChart3 } from "lucide-react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5" />
          Roof CRM
        </h2>
        <nav className="flex flex-col space-y-2">
          <Link
            href="/dashboard/customer"
            className="flex items-center gap-2 hover:text-blue-600"
          >
            <User className="w-4 h-4" /> Customer
          </Link>
          <Link
            href="/dashboard/estimator"
            className="flex items-center gap-2 hover:text-blue-600"
          >
            <FileText className="w-4 h-4" /> Estimator
          </Link>
          <Link
            href="/dashboard/admin"
            className="flex items-center gap-2 hover:text-blue-600"
          >
            <BarChart3 className="w-4 h-4" /> Admin
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
            <span className="text-sm font-medium">John Doe</span>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
