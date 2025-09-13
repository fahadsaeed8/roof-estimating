import React from "react";
import DashboardLayout from "../page";

const CustomerDashboard = () => {
  // Dummy Data
  const estimates = [
    { id: 1, name: "Roof Repair", amount: "$4,500", status: "Pending" },
    { id: 2, name: "Full Replacement", amount: "$12,000", status: "Approved" },
  ];

  const proposals = [
    { id: 1, title: "Roof Shingle Replacement", status: "Sent" },
    { id: 2, title: "Flat Roof Estimate", status: "Draft" },
  ];

  const contracts = [
    { id: 1, contract: "Roofing Contract #001", signed: "Yes" },
    { id: 2, contract: "Repair Contract #002", signed: "No" },
  ];

  const payments = [
    { id: 1, date: "2025-09-01", amount: "$2,500", status: "Paid" },
    { id: 2, date: "2025-09-05", amount: "$1,200", status: "Pending" },
  ];

  const jobStatus = [
    { id: 1, job: "Roof Repair", progress: "In Progress" },
    { id: 2, job: "Replacement", progress: "Completed" },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Customer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estimates */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Estimates</h2>
          <ul className="text-sm space-y-1">
            {estimates.map((e) => (
              <li key={e.id} className="flex justify-between border-b pb-1">
                <span>
                  {e.name} - {e.amount}
                </span>
                <span className="text-gray-500">{e.status}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Proposals */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Proposals</h2>
          <ul className="text-sm space-y-1">
            {proposals.map((p) => (
              <li key={p.id} className="flex justify-between border-b pb-1">
                <span>{p.title}</span>
                <span className="text-gray-500">{p.status}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contracts */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Contracts</h2>
          <ul className="text-sm space-y-1">
            {contracts.map((c) => (
              <li key={c.id} className="flex justify-between border-b pb-1">
                <span>{c.contract}</span>
                <span className="text-gray-500">Signed: {c.signed}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Payments */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Payments</h2>
          <ul className="text-sm space-y-1">
            {payments.map((p) => (
              <li key={p.id} className="flex justify-between border-b pb-1">
                <span>
                  {p.date} - {p.amount}
                </span>
                <span className="text-gray-500">{p.status}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Job Status */}
        <div className="bg-white p-4 rounded shadow col-span-1 md:col-span-2">
          <h2 className="font-semibold mb-2">Job Status</h2>
          <ul className="text-sm space-y-1">
            {jobStatus.map((j) => (
              <li key={j.id} className="flex justify-between border-b pb-1">
                <span>{j.job}</span>
                <span>{j.progress}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
