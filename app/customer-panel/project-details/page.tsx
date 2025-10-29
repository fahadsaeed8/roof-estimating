"use client";

import React, { useEffect, useState } from "react";
import { getUserProjectsAPI } from "@/services/auth";
import CustomerDashboardLayout from "@/app/dashboard/customer/page";
import { Search, Trash2 } from "lucide-react";
import axios from "axios";

interface Project {
  _id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  mobile_number: string;
  roof_type: string;
  property_type: string;
  address: {
    street: string;
    city?: string;
    state?: string;
    country?: string;
    zip_code?: string;
  };
  createdAt: string;
}

export default function ProjectDetailsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roofFilter, setRoofFilter] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getUserProjectsAPI();
        const dataArray = Array.isArray(response.data) ? response.data : [];
        setProjects(dataArray);
        setFilteredProjects(dataArray);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        alert("Failed to load projects. Try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.mobile_number.includes(searchTerm)
      );
    }

    if (roofFilter) {
      filtered = filtered.filter((p) => p.roof_type === roofFilter);
    }

    if (propertyFilter) {
      filtered = filtered.filter((p) => p.property_type === propertyFilter);
    }

    setFilteredProjects(filtered);
  }, [searchTerm, roofFilter, propertyFilter, projects]);

const deleteProject = async (id: string) => {
  try {
    const token = localStorage.getItem("token"); // agar auth token use ho raha hai
    const res = await fetch(`http://88.99.241.139:5000/api/roof-estimate-projects/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // optional, agar API require kare
      },
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to delete project");
      return;
    }

    // Remove project from state
    setProjects((prev) => prev.filter((p) => p._id !== id));
    setFilteredProjects((prev) => prev.filter((p) => p._id !== id));
    alert("Project deleted successfully");
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};


  if (loading) {
    return (
      <CustomerDashboardLayout>
        <div className="min-h-screen flex justify-center items-center">
          <p className="text-gray-500 text-lg">Loading projects...</p>
        </div>
      </CustomerDashboardLayout>
    );
  }

  if (!projects.length) {
    return (
      <CustomerDashboardLayout>
        <div className="min-h-screen flex justify-center items-center">
          <p className="text-gray-500 text-lg">No projects found.</p>
        </div>
      </CustomerDashboardLayout>
    );
  }

  // Get unique roof types and property types for filter dropdowns
  const roofTypes = Array.from(new Set(projects.map((p) => p.roof_type)));
  const propertyTypes = Array.from(
    new Set(projects.map((p) => p.property_type))
  );

  return (
    <CustomerDashboardLayout>
      <main className="min-h-screen px-4 md:px-8 py-10 bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Projects</h1>

        {/* Filters Card */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <div className="flex items-center flex-1 max-w-md">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 placeholder-gray-400"
            />
          </div>

          {/* Roof Type Filter */}
          <select
            value={roofFilter}
            onChange={(e) => setRoofFilter(e.target.value)}
            className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
          >
            <option value="">All Roof Types</option>
            {roofTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          {/* Property Type Filter */}
          <select
            value={propertyFilter}
            onChange={(e) => setPropertyFilter(e.target.value)}
            className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
          >
            <option value="">All Property Types</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Table Card */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Roof Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Property Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <tr
                  key={project._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    {project.first_name} {project.middle_name || ""}{" "}
                    {project.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    {project.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    {project.mobile_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    {project.roof_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    {project.property_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    {project.address.street || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    <button onClick={() => deleteProject(project._id)}>
                      <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </CustomerDashboardLayout>
  );
}
