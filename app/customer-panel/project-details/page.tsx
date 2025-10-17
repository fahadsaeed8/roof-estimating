"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Home,
  Ruler,
  Layers,
  MapPin,
  CalendarDays,
} from "lucide-react";
import CustomerDashboardLayout from "@/app/dashboard/customer/page";

export default function ProjectDetailsPage() {
  const project = {
    id: "AX-PR-1025",
    clientName: "John Doe",
    address: "123 Main Street, California, Unied States",
    roofType: "Gable Roof",
    propertyType: "Residential - 2 Story",
    // totalArea: "2450 sq.ft",
    // perimeter: "190 ft",
    createdAt: "2025-10-15",
  };

  return (
    <CustomerDashboardLayout>
      <main className="min-h-screen flex justify-center items-start py-10 px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl p-8"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <ClipboardList className="w-7 h-7 text-blue-600" />
              Project Details
            </h1>
            <button
              onClick={() => alert("PDF report coming soon!")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all duration-200"
            >
              Download Report
            </button>
          </div>

          {/* Project Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard
              icon={<Layers className="text-blue-500 w-5 h-5" />}
              label="Project ID"
              value={project.id}
            />
            <InfoCard
              icon={<Home className="text-green-500 w-5 h-5" />}
              label="Client Name"
              value={project.clientName}
            />
            <InfoCard
              icon={<MapPin className="text-red-500 w-5 h-5" />}
              label="Address"
              value={project.address}
            />
            <InfoCard
              icon={<Ruler className="text-purple-500 w-5 h-5" />}
              label="Roof Type"
              value={project.roofType}
            />
            <InfoCard
              icon={<Ruler className="text-orange-500 w-5 h-5" />}
              label="Property Type"
              value={project.propertyType}
            />
            {/* <InfoCard
              icon={<Ruler className="text-indigo-500 w-5 h-5" />}
              label="Total Area"
              value={project.totalArea}
            />
            <InfoCard
              icon={<Ruler className="text-teal-500 w-5 h-5" />}
              label="Perimeter"
              value={project.perimeter}
            /> */}
            <InfoCard
              icon={<CalendarDays className="text-pink-500 w-5 h-5" />}
              label="Project Created Date"
              value={project.createdAt}
            />
          </div>

          {/* Summary Section */}
          <div className="mt-10 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">
              Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">
              This project represents a {project.propertyType.toLowerCase()}{" "}
              located at{" "}
              <span className="font-semibold">{project.address}</span>. The roof
              type is <span className="font-semibold">{project.roofType}</span>{" "}
              {/* with a total coverage area of{" "} */}
              {/* <span className="font-semibold">{project.totalArea}</span> */}
              {/* and perimeter of{" "} */}
              {/* <span className="font-semibold">{project.perimeter}</span>. It was */}
              initiated on{" "}
              <span className="font-semibold">{project.createdAt}</span>.
            </p>
          </div>
        </motion.div>
      </main>
    </CustomerDashboardLayout>
  );
}

// ✅ Reusable Info Card Component
function InfoCard({ icon, label, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col gap-2 transition-all"
    >
      <div className="flex items-center gap-2 text-gray-700 font-semibold">
        {icon}
        {label}
      </div>
      <p className="text-gray-900 font-medium">{value}</p>
    </motion.div>
  );
}
