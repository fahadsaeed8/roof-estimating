"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Shield } from "lucide-react";
import AdminDashboardLayout from "@/app/dashboard/admin/page";

type Role = "Admin" | "Customer" | "Editor";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: Role;
}

const initialUsers: UserData[] = [
  { id: 1, name: "Ali Khan", email: "ali@example.com", role: "Customer" },
  { id: 2, name: "Sara Ahmed", email: "sara@example.com", role: "Editor" },
  { id: 3, name: "Ahmed Raza", email: "ahmed@example.com", role: "Admin" },
];

export default function AssignRolesPage() {
  const [users, setUsers] = useState<UserData[]>(initialUsers);

  const handleRoleChange = (id: number, newRole: Role) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, role: newRole } : user))
    );
  };

  const assignRole = (user: UserData) => {
    // 👇 Yahan API call lagani hai
    console.log(`Assigned ${user.role} role to ${user.name} (${user.email})`);
    alert(`Role updated: ${user.name} is now ${user.role}`);
  };

  return (
    <AdminDashboardLayout>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header */}
        <header className="flex items-center gap-2">
          <Shield className="text-blue-600" size={28} />
          <h1 className="text-2xl font-bold text-gray-900">
            Assign User Roles
          </h1>
        </header>

        {/* Users Table */}
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="w-full border bg-white border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left font-bold">
                  User
                </th>
                <th className="px-4 py-3 text-left font-bold">
                  Email
                </th>
                <th className="px-4 py-3 text-left font-bold">
                  Role
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b last:border-none border-gray-300 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2 flex items-center gap-2">
                    <User className="text-gray-500" size={18} />
                    {user.name}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value as Role)
                      }
                      className="border border-gray-300 outline-none cursor-pointer rounded-md px-3 py-1 text-sm focus:border focus:border-teal-500"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Customer">Customer</option>
                      <option value="Editor">Editor</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => assignRole(user)}
                      className="px-4 py-1 cursor-pointer text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Assign Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AdminDashboardLayout>
  );
}
