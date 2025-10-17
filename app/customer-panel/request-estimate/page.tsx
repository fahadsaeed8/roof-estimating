"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, MapPin } from "lucide-react";
import { useState } from "react";
import CustomerDashboardLayout from "@/app/dashboard/customer/page";
import { useRouter } from "next/navigation";

import MapModal from "./mapModel";
import MapPopup from "./mapModel";

export default function CreateProjectForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showMap, setShowMap] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      mobile: "",
      email: "",
      address: "",
      roofType: "",
      propertyType: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      middleName: Yup.string(),
      lastName: Yup.string().required("Last name is required"),
      mobile: Yup.string().required("Mobile number is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      address: Yup.string().required("Address is required"),
      roofType: Yup.string().required("Please select roof type"),
      propertyType: Yup.string().required("Please select property type"),
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


  const handleSubmit = () => {
    // abhi fake save
    router.push("/customer-panel/project-details");
  };

  
  return (
    <CustomerDashboardLayout>
      <main className="min-h-screen flex flex-col mt-15 items-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-5xl bg-white rounded-xl shadow-xl p-6 md:p-12 relative"
        >
          {!submitted ? (
            <>
              <div className="flex justify-between items-center pb-4 mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center w-full">
                  Create New Project
                </h2>
              </div>
              {/* -------- UPDATED FORM FIELDS (GRID FIXED) -------- */}
              <form
                onSubmit={formik.handleSubmit}
                className="grid grid-cols-1 md:grid-cols-12 gap-4"
              >
                {/* Full Name (3 fields in one line) */}
                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="John"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.firstName}
                    </p>
                  )}
                </div>

                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="middleName"
                    value={formik.values.middleName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="A."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Doe"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.lastName}
                    </p>
                  )}
                </div>

                {/* Mobile + Email (2 fields in one line) */}
                <div className="md:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Mobile Number *
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="+1 234 567 890"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  {formik.touched.mobile && formik.errors.mobile && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.mobile}
                    </p>
                  )}
                </div>

                <div className="md:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="example@email.com"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                <div className="md:col-span-12 relative">
                  <label className="block text-sm font-medium text-gray-700">
                    Address *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Start typing address..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    {/* Map icon on right side */}
                    <MapPin
                      className="absolute right-3 top-2.5 text-blue-500 cursor-pointer hover:text-blue-600"
                      size={20}
                      onClick={() => setShowMap(true)}
                    />
                  </div>

                  {formik.touched.address && formik.errors.address && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.address}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    (Click map icon to select address)
                  </p>

                  {showMap && (
                    <MapPopup
                      onClose={() => setShowMap(false)}
                      onSelect={(address: string, coords: { lat: number; lng: number }) => {
                        formik.setFieldValue("address", address);
                        setShowMap(false);
                      }}
                    />
                  )}
                </div>

                {/* Roof Type + Property Type */}
                <div className="md:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Roof Type / Material *
                  </label>
                  <select
                    name="roofType"
                    value={formik.values.roofType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">Select Roof Type</option>
                    <option value="shingle">Asphalt Shingle</option>
                    <option value="metal">Metal Roof</option>
                    <option value="tile">Tile Roof</option>
                    <option value="flat">Flat Roof</option>
                  </select>
                  {formik.touched.roofType && formik.errors.roofType && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.roofType}
                    </p>
                  )}
                </div>

                <div className="md:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Property Type / Stories *
                  </label>
                  <select
                    name="propertyType"
                    value={formik.values.propertyType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">Select Property Type</option>
                    <option value="single">Single Story</option>
                    <option value="double">Double Story</option>
                    <option value="commercial">Commercial</option>
                  </select>
                  {formik.touched.propertyType &&
                    formik.errors.propertyType && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.propertyType}
                      </p>
                    )}
                </div>

                {/* Buttons */}
                <div className="md:col-span-12 flex flex-wrap justify-between gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-md font-semibold shadow hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin w-5 h-5 inline mr-2" />
                    ) : null}
                    Create & Save Project
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
                </div>
              </form>
              {/* -------- END UPDATED FORM FIELDS -------- */}

              {/* -------- OLD FORM (commented for reference) --------
                Previous fields have been commented out as per new requirements
              ----------------------------------------------------- */}
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
