"use client";

import React, { useState } from "react";

export default function CustomerDashboard() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-6">Customer Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold">Active Orders</h2>
                <p className="text-2xl font-bold">5</p>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold">Pending Payments</h2>
                <p className="text-2xl font-bold">$1,200</p>
              </div>
            </div>
          </div>
        );
      case "Orders":
        return (
          <div>
            <h1 className="text-2xl font-bold mb-4">My Orders</h1>
            <div className="bg-white shadow rounded-lg p-6">
              <ul className="space-y-3">
                <li className="p-3 border rounded-lg hover:bg-gray-50">
                  Order #2045 – Roof Repair –{" "}
                  <span className="text-green-600">Completed</span>
                </li>
                <li className="p-3 border rounded-lg hover:bg-gray-50">
                  Order #2067 – New Installation –{" "}
                  <span className="text-yellow-600">In Progress</span>
                </li>
                <li className="p-3 border rounded-lg hover:bg-gray-50">
                  Order #2090 – Tile Replacement –{" "}
                  <span className="text-red-600">Pending</span>
                </li>
              </ul>
            </div>
          </div>
        );
      case "Invoices":
        return (
          <div>
            <h1 className="text-2xl font-bold mb-4">Invoices</h1>
            <div className="bg-white shadow rounded-lg p-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-2">Invoice #</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-2">INV-1001</td>
                    <td className="p-2">$450</td>
                    <td className="p-2 text-green-600">Paid</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-2">INV-1002</td>
                    <td className="p-2">$750</td>
                    <td className="p-2 text-yellow-600">Pending</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-2">INV-1003</td>
                    <td className="p-2">$1200</td>
                    <td className="p-2 text-red-600">Overdue</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case "Support":
        return (
          <div>
            <h1 className="text-2xl font-bold mb-4">Support</h1>
            <div className="bg-white shadow rounded-lg p-6">
              <p className="text-gray-600">
                Need help? Submit a ticket below and our support team will reach
                out.
              </p>
              <form className="mt-4 space-y-4">
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full p-2 border rounded"
                />
                <textarea
                  placeholder="Describe your issue..."
                  className="w-full p-2 border rounded"
                  rows={4}
                ></textarea>
                <button className="bg-yellow-700 text-white px-4 py-2 rounded hover:bg-yellow-600">
                  Submit Ticket
                </button>
              </form>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-yellow-700 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-yellow-500">
          Customer
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {["Dashboard", "Orders", "Invoices", "Support"].map((menu) => (
            <button
              key={menu}
              onClick={() => setActiveMenu(menu)}
              className={`block w-full text-left p-2 rounded ${
                activeMenu === menu ? "bg-yellow-500" : "hover:bg-yellow-500"
              }`}
            >
              {menu}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">{renderContent()}</main>
    </div>
  );
}
