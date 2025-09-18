"use client";

import DashboardLayout from "@/app/page";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { Upload, CheckCircle, Loader2 } from "lucide-react";
import CustomerDashboardLayout from "@/app/dashboard/customer/page";

export default function RequestEstimatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Formik with Yup Validation
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      roofType: "",
      areaSize: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string().required("Phone number is required"),
      address: Yup.string().required("Address is required"),
      roofType: Yup.string().required("Please select a roof type"),
      areaSize: Yup.number()
        .typeError("Must be a number")
        .positive("Must be greater than 0")
        .required("Roof area size is required"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      setTimeout(() => {
        console.log("Form Submitted ✅", values, file);
        setLoading(false);
        setSubmitted(true);
      }, 2000); // simulating API call
    },
  });

  // ✅ File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <CustomerDashboardLayout>
      <main className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl bg-white p-4 md:p-8 rounded-2xl shadow-lg mx-auto"
        >
          {!submitted ? (
            <>
              {/* Title */}
              <h2 className="text-3xl text-center font-bold mb-7 text-gray-900">
                Request Roof Estimate
              </h2>
              <p className="text-gray-600 mb-6">
                Please fill out the form below and our team will get back to you
                with a detailed roof estimate.
              </p>

              {/* Form */}
              <form
                onSubmit={formik.handleSubmit}
                className="space-y-5 min-w-0"
              >
                {/* Name */}
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full min-w-0 border border-gray-300 rounded-lg px-4 py-2 focus:border focus:border-green-400 outline-none ${
                      formik.touched.name && formik.errors.name
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="John Doe"
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full min-w-0 border border-gray-300 rounded-lg px-4 py-2 focus:border focus:border-green-400 outline-none ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="example@mail.com"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full min-w-0 border border-gray-300 rounded-lg px-4 py-2 focus:border focus:border-green-400 outline-none ${
                      formik.touched.phone && formik.errors.phone
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="(123) 456-7890"
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.phone}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full min-w-0 border border-gray-300 rounded-lg px-4 py-2 focus:border focus:border-green-400 outline-none ${
                      formik.touched.address && formik.errors.address
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="123 Main St, City"
                  />
                  {formik.touched.address && formik.errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.address}
                    </p>
                  )}
                </div>

                {/* Roof Type */}
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Roof Type
                  </label>
                  <select
                    name="roofType"
                    value={formik.values.roofType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full min-w-0 border border-gray-300 rounded-lg px-4 py-2 focus:border focus:border-green-400 outline-none ${
                      formik.touched.roofType && formik.errors.roofType
                        ? "border-red-500"
                        : ""
                    }`}
                  >
                    <option value="">Select roof type</option>
                    <option value="asphalt">Asphalt Shingles</option>
                    <option value="metal">Metal Roofing</option>
                    <option value="tile">Tile Roofing</option>
                    <option value="flat">Flat Roof</option>
                  </select>
                  {formik.touched.roofType && formik.errors.roofType && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.roofType}
                    </p>
                  )}
                </div>

                {/* Roof Area */}
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Roof Area (sq. ft.)
                  </label>
                  <input
                    type="number"
                    name="areaSize"
                    value={formik.values.areaSize}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full min-w-0 border border-gray-300 rounded-lg px-4 py-2 focus:border focus:border-green-400 outline-none ${
                      formik.touched.areaSize && formik.errors.areaSize
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="e.g., 1500"
                  />
                  {formik.touched.areaSize && formik.errors.areaSize && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.areaSize}
                    </p>
                  )}
                </div>

                {/* File Upload */}
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Roof Images
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:border-green-400 transition min-w-0">
                    <Upload className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full text-sm truncate"
                    />
                  </div>
                  {file && (
                    <p className="mt-2 text-sm text-gray-600 truncate">
                      Selected file:{" "}
                      <span className="font-medium truncate block max-w-full">
                        {file.name}
                      </span>
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-1/3 flex justify-center items-center bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 cursor-pointer rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-70"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin w-5 h-5 mr-2" />
                    ) : null}
                    {loading ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                Request Submitted Successfully
              </h2>
              <p className="text-gray-600">
                Our team will contact you soon with your roof estimate details.
              </p>
            </motion.div>
          )}
        </motion.div>
      </main>
    </CustomerDashboardLayout>
  );
}
