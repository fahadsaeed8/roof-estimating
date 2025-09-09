"use client";
import Image from "next/image";
import { useState } from "react";

export default function SignUp() {
  const [form, setForm] = useState({
    accountType: "",
    email: "",
    verifyEmail: "",
    firstName: "",
    lastName: "",
    company: "",
    postalCode: "",
    agree: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name as keyof typeof form]:
        type === "checkbox" && e.target instanceof HTMLInputElement
          ? e.target.checked
          : value,
    });
  };

  return (
    <div className="min-h-screen pt-[100px] pb-10 flex items-center justify-center bg-[#0B2244]">
      <div className="bg-white rounded-md shadow-md p-8 w-[500px] text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/Black-Logo-main.png"
            alt="iRoofing Logo"
            width={320}
            height={40}
            className="-mt-8"
          />{" "}
        </div>

        {/* Title */}
        <div className="-mt-10">
          <h2 className="text-3xl font-bold text-[#0B2244] mb-2">
            Create Account
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Register to quickly access past orders and check out faster in the
            future.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4 text-left">
          {/* Account Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Who are you? <span className="text-red-500">*</span>
            </label>
            <select
              name="accountType"
              value={form.accountType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2244]"
            >
              <option value="">Select an Account Type</option>
              <option value="contractor">Contractor</option>
              <option value="distributor">Distributor</option>
              <option value="homeowner">Homeowner</option>
              <option value="propertyOwner">Property Owner</option>
              <option value="specifier">Specifier</option>
              <option value="architect">Architect</option>
              <option value="insuranceAgent">Insurance Agent</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2244]"
            />
          </div>

          {/* Verify Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Verify Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="verifyEmail"
              value={form.verifyEmail}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2244]"
            />
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2244]"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2244]"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2244]"
            />
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2244]"
            />
          </div>

          {/* Agreement */}
          <div className="text-xs text-gray-600 space-y-2 max-h-[120px] overflow-y-auto  p-2 rounded-md">
            <p>
              By checking the box below and clicking the CREATE ACCOUNT button:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>
                You accept and hereby electronically sign the Roofing Privacy
                Policy and Terms of Use.
              </li>
              <li>
                You consent to Roofing using your information to provide
                services and updates.
              </li>
              <li>You confirm you have read and understood the agreement.</li>
            </ul>
          </div>

          {/* Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              className="h-4 w-4 text-[#0B2244] border-gray-300 rounded focus:ring-[#0B2244]"
            />
            <label className="text-sm text-gray-700">I AGREE</label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!form.agree}
            className={`w-full py-2 rounded-md text-white text-sm font-medium transition 
              ${
                form.agree
                  ? "bg-[#0B2244] hover:bg-[#132c57]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
          >
            CREATE ACCOUNT
          </button>
        </form>
      </div>
    </div>
  );
}
