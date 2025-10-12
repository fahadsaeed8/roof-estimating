"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";
import CustomerDashboardLayout from "@/app/dashboard/customer/page";
import { useRouter } from "next/navigation";

export default function CreateProjectForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      projectName: "",
      email: "",
      phone: "",
      jobNumber: "",
      jobOwner: "",
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    validationSchema: Yup.object({
      projectName: Yup.string().required("Project name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string().required("Phone number is required"),
      jobNumber: Yup.string(),
      jobOwner: Yup.string().required("Job owner is required"),
      street: Yup.string().required("Street address is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      zip: Yup.string().required("Zip code is required"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      setTimeout(() => {
        console.log("Form Submitted ✅", values);
        setLoading(false);
        setSubmitted(true);
      }, 2000);
    },
  });

  return (
    <CustomerDashboardLayout>
      <main className="flex justify-center items-center px-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-5xl bg-white rounded-xl shadow-xl p-6 md:p-10"
        >
          {!submitted ? (
            <>
              {/* Header */}
              <div className="flex justify-between items-center pb-4 mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center w-full">
                  Create New Project
                </h2>
              </div>

              {/* Form */}
              <form
                onSubmit={formik.handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Project Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    name="projectName"
                    value={formik.values.projectName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Salas Mike"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  {formik.touched.projectName && formik.errors.projectName && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.projectName}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Add a phone number..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.phone}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Add an email..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                {/* Job Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Job Number
                  </label>
                  <input
                    type="text"
                    name="jobNumber"
                    value={formik.values.jobNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Add a job number..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Street */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Property Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formik.values.street}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="1234 Cliffwood Ave"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  {formik.touched.street && formik.errors.street && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.street}
                    </p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  {formik.touched.city && formik.errors.city && (
                    <p className="text-red-500 text-sm">{formik.errors.city}</p>
                  )}
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  {formik.touched.state && formik.errors.state && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.state}
                    </p>
                  )}
                </div>

                {/* Zip */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Zip Code *
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={formik.values.zip}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  {formik.touched.zip && formik.errors.zip && (
                    <p className="text-red-500 text-sm">{formik.errors.zip}</p>
                  )}
                </div>

                {/* Job Owner */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Job Owner *
                  </label>
                  <input
                    type="text"
                    name="jobOwner"
                    value={formik.values.jobOwner}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Shafic Budron"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  {formik.touched.jobOwner && formik.errors.jobOwner && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.jobOwner}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="col-span-1 md:col-span-2 flex flex-wrap justify-between gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-md font-semibold shadow hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin w-5 h-5 inline mr-2" />
                    ) : null}
                    Create & Go to Project
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem(
                        "projectData",
                        JSON.stringify(formik.values)
                      );

                      router.push("/property-map");
                    }}
                    className="flex-1 cursor-pointer bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-md font-semibold shadow hover:opacity-90"
                  >
                    Create & Go to Measurement
                  </button>

                  <button
                    type="button"
                    className="flex-1 cursor-pointer bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 rounded-md font-semibold shadow hover:opacity-90"
                  >
                    Create & Go to Roof Visualizer
                  </button>
                </div>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-16"
            >
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                Project Created Successfully
              </h2>
              <p className="text-gray-600">
                Your new project has been created. You can now continue to the
                next step.
              </p>
            </motion.div>
          )}
        </motion.div>
      </main>
    </CustomerDashboardLayout>
  );
}
