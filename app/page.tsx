// import Footer from "@/components/Footer";
// import Header from "@/components/Header";
// import HeroSection from "@/components/HeroSection";
// import React from "react";

// const Page = () => {
//   return (
//     <div>
//       <Header />
//       <HeroSection />
//       <Footer />
//     </div>
//   );
// };

// export default Page;

// "use client";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState } from "react";
// import { Menu, LogOut, LayoutDashboard, FileText, CreditCard, Briefcase, ClipboardPlus } from "lucide-react";

// const navItems = [
//   { name: "Dashboard", href: "/customer-panel/dashboard", icon: LayoutDashboard },
//   { name: "Proposals", href: "/customer-panel/proposal", icon: FileText },
//   { name: "Payments", href: "/customer-panel/payment", icon: CreditCard },
//   { name: "Job Progress", href: "/customer-panel/job-progress", icon: Briefcase },
//   { name: "Request Estimate", href: "/customer-panel/request-estimate", icon: ClipboardPlus },
// ];

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const pathname = usePathname();

//   return (
//     <div className="flex h-screen bg-gray-100 text-gray-900">
//       {/* Sidebar */}
//       <aside
//         className={`fixed z-20 inset-y-0 left-0 transform bg-white shadow-lg w-64 transition-transform duration-300 ease-in-out
//         ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
//       >
//         <div className="h-16 flex items-center justify-center font-bold text-xl border-b bg-gradient-to-r from-green-600 to-teal-600 text-white">
//           Customer Panel
//         </div>
//         <nav className="p-4 space-y-1">
//           {navItems.map((item) => {
//             const isActive = pathname.startsWith(item.href);
//             const Icon = item.icon;
//             return (
//               <Link
//                 key={item.name}
//                 href={item.href}
//                 className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200
//                   ${
//                     isActive
//                       ? "bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-md"
//                       : "text-gray-700 hover:bg-green-100"
//                   }`}
//               >
//                 <Icon className="h-5 w-5" />
//                 <span>{item.name}</span>
//               </Link>
//             );
//           })}
//         </nav>
//         <div className="absolute bottom-0 w-full p-4 border-t">
//           <button
//             className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
//             aria-label="Logout"
//           >
//             <LogOut className="h-5 w-5" />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main content */}
//       <div className="flex-1 flex flex-col md:ml-64">
//         {/* Navbar */}
//         <header className="h-16 bg-white shadow flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             aria-label="Open sidebar menu"
//           >
//             <Menu className="h-6 w-6" />
//           </button>
//           <h1 className="font-semibold text-lg tracking-wide">Roof Estimate CRM</h1>
//           <div className="flex items-center space-x-4">
//             <span className="text-sm text-gray-600">John Doe</span>
//             <img
//               src="https://i.pravatar.cc/40"
//               alt="profile"
//               className="w-10 h-10 rounded-full border shadow-sm"
//             />
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50">{children}</main>
//       </div>
//     </div>
//   );
// }
"use client";
import { useState } from "react";
import CustomerPanelNavbar from "@/components/customerpabelnavbar";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { Upload, CheckCircle, Loader2 } from "lucide-react";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="flex text-gray-900 bg-gray-50">
      <div className="flex-1 flex flex-col">
        <CustomerPanelNavbar />
        <main className=" flex justify-center my-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg"
          >
            {!submitted ? (
              <>
                {/* Title */}
                <h2 className="text-3xl text-center font-bold mb-7 text-gray-900">
                  Request Roof Estimate
                </h2>
                <p className="text-gray-600 mb-6">
                  Please fill out the form below and our team will get back to
                  you with a detailed roof estimate.
                </p>

                {/* Form */}
                <form onSubmit={formik.handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:border focus:border-green-400 outline-none ${
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:border focus:border-green-400 outline-none ${
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:border focus:border-green-400 outline-none ${
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:border focus:border-green-400 outline-none ${
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Roof Type
                    </label>
                    <select
                      name="roofType"
                      value={formik.values.roofType}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:border focus:border-green-400 outline-none ${
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Roof Area (sq. ft.)
                    </label>
                    <input
                      type="number"
                      name="areaSize"
                      value={formik.values.areaSize}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:border focus:border-green-400 outline-none ${
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Roof Images
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:border-green-400 transition">
                      <Upload className="w-5 h-5 text-gray-500 mr-2" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-sm"
                      />
                    </div>
                    {file && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selected file:{" "}
                        <span className="font-medium">{file.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-center">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-1/3 flex justify-center items-center bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 cursor-pointer rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-70"
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
                  Our team will contact you soon with your roof estimate
                  details.
                </p>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
