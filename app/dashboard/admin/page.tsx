"use client";
import React from "react";

import DashboardLayout from "../page";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  // Dummy Data
  const kpis = {
    users: 1200,
    activeLeads: 320,
    conversions: "12%",
    jobs: 45,
    payments: "$12,500",
  };

  const leads = [
    { name: "John Doe", status: "Pending" },
    { name: "Jane Smith", status: "Approved" },
    { name: "Sam Wilson", status: "Rejected" },
  ];

  const jobs = [
    { id: 1, title: "Roof Repair", status: "In Progress" },
    { id: 2, title: "New Installation", status: "Completed" },
  ];

  const payments = [
    { id: 1, customer: "John Doe", amount: "$500" },
    { id: 2, customer: "Jane Smith", amount: "$1200" },
  ];

  const reportData = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 5000 },
    { month: "Apr", revenue: 2500 },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPIs */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">KPIs</h2>
          <ul className="space-y-1 text-sm">
            <li>Users: {kpis.users}</li>
            <li>Active Leads: {kpis.activeLeads}</li>
            <li>Conversions: {kpis.conversions}</li>
            <li>Jobs: {kpis.jobs}</li>
            <li>Payments: {kpis.payments}</li>
          </ul>
        </div>

        {/* Leads */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Leads</h2>
          <ul className="text-sm space-y-1">
            {leads.map((lead, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{lead.name}</span>
                <span className="text-gray-500">{lead.status}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Conversions */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Conversions</h2>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full"
              style={{ width: kpis.conversions }}
            ></div>
          </div>
          <p className="text-sm mt-1">{kpis.conversions} this month</p>
        </div>

        {/* Jobs */}
        <div className="bg-white p-4 rounded shadow md:col-span-2">
          <h2 className="font-semibold mb-2">Jobs</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1">ID</th>
                <th className="text-left py-1">Title</th>
                <th className="text-left py-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b">
                  <td className="py-1">{job.id}</td>
                  <td className="py-1">{job.title}</td>
                  <td className="py-1">{job.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payments */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Payments</h2>
          <ul className="text-sm space-y-1">
            {payments.map((p) => (
              <li key={p.id} className="flex justify-between">
                <span>{p.customer}</span>
                <span>{p.amount}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Reports */}
        <div className="bg-white p-4 rounded shadow md:col-span-2">
          <h2 className="font-semibold mb-2">Reports</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={reportData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
