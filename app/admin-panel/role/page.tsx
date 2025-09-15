"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  UserCog,
  Briefcase,
  Calculator,
  Users,
  HardHat,
} from "lucide-react";

const roles = [
  {
    name: "Admin",
    description: "Manage templates, users, contracts & payments.",
    icon: UserCog,
    route: "/admin-panel/dashboard",
    color: "from-purple-600 to-indigo-600",
  },
  {
    name: "Sales Rep",
    description: "Create estimates and send proposals.",
    icon: Briefcase,
    route: "/sales/dashboard",
    color: "from-blue-600 to-cyan-600",
  },
  {
    name: "Estimator",
    description: "Input material & labor details for projects.",
    icon: Calculator,
    route: "/estimator/dashboard",
    color: "from-green-600 to-emerald-600",
  },
  {
    name: "Crew",
    description: "View assigned jobs and upload progress photos.",
    icon: HardHat,
    route: "/crew/dashboard",
    color: "from-orange-600 to-amber-600",
  },
  {
    name: "Customer",
    description: "View/sign proposals, make payments, track job status.",
    icon: Users,
    route: "/customer-panel/dashboard",
    color: "from-pink-600 to-rose-600",
  },
];

export default function SelectRolePage() {
  const router = useRouter();
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">
          Select Your Role
        </h1>
        <p className="text-gray-600">
          Choose your role to continue into the Roof Estimate CRM.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {roles.map((role) => {
          const Icon = role.icon;
          const isHovered = hoveredRole === role.name;
          return (
            <div
              key={role.name}
              onClick={() => router.push(role.route)}
              onMouseEnter={() => setHoveredRole(role.name)}
              onMouseLeave={() => setHoveredRole(null)}
              className={`cursor-pointer relative p-6 rounded-2xl shadow-md bg-white transition-transform duration-300 hover:scale-105 group`}
            >
              {/* Gradient Background Animation */}
              <div
                className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${role.color}`}
              ></div>

              {/* Content */}
              <div className="relative flex flex-col items-center text-center space-y-3">
                <div
                  className={`p-4 rounded-full ${
                    isHovered ? "bg-white text-gray-800" : "bg-gray-100 text-gray-600"
                  } transition-colors duration-300`}
                >
                  <Icon className="h-10 w-10" />
                </div>
                <h3
                  className={`text-xl font-semibold ${
                    isHovered ? "text-white" : "text-gray-800"
                  }`}
                >
                  {role.name}
                </h3>
                <p
                  className={`text-sm ${
                    isHovered ? "text-gray-100" : "text-gray-600"
                  }`}
                >
                  {role.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
