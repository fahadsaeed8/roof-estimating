import React from "react";
import DashboardLayout from "../page";

const EstimatorDashboard = () => {
  // Dummy Data
  const inspections = [
    { id: 1, customer: "John Doe", date: "2025-09-10", status: "Completed" },
    { id: 2, customer: "Jane Smith", date: "2025-09-12", status: "Pending" },
  ];

  const proposals = [
    { id: 1, title: "Roof Replacement", amount: "$8,500", status: "Sent" },
    { id: 2, title: "Shingle Repair", amount: "$2,000", status: "Draft" },
  ];

  const jobs = [
    { id: 1, name: "Roof Repair - John Doe", progress: "In Progress" },
    { id: 2, name: "New Installation - Jane Smith", progress: "Completed" },
  ];

  const messages = [
    { id: 1, from: "Admin", text: "Please update inspection details." },
    { id: 2, from: "Customer", text: "Can you revise the proposal?" },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Estimator Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inspections */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Inspections</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1">Customer</th>
                <th className="text-left py-1">Date</th>
                <th className="text-left py-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {inspections.map((i) => (
                <tr key={i.id} className="border-b">
                  <td className="py-1">{i.customer}</td>
                  <td className="py-1">{i.date}</td>
                  <td className="py-1">{i.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Proposals */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Proposals</h2>
          <ul className="text-sm space-y-1">
            {proposals.map((p) => (
              <li key={p.id} className="flex justify-between">
                <span>
                  {p.title} - {p.amount}
                </span>
                <span className="text-gray-500">{p.status}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Jobs */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Jobs</h2>
          <ul className="text-sm space-y-1">
            {jobs.map((job) => (
              <li key={job.id} className="flex justify-between">
                <span>{job.name}</span>
                <span>{job.progress}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Communication */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Communication</h2>
          <ul className="text-sm space-y-2">
            {messages.map((m) => (
              <li key={m.id} className="border-b pb-1">
                <strong>{m.from}:</strong> {m.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EstimatorDashboard;
