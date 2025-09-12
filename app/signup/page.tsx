"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signupAPI } from "@/services/auth";
import Cookies from "js-cookie";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: signupAPI,
    onSuccess: (data) => {
      Cookies.set("signupemail", data?.email);
      toast.success(data?.message);
      router.push("/otp");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail);
    },
  });

  // ✅ Yup validation schema
  const validationSchema = Yup.object({
    account_type: Yup.string().required("Account type is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    verifyEmail: Yup.string()
      .oneOf([Yup.ref("email")], "Emails must match")
      .required("Please verify your email"),
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    company: Yup.string(),
    postal_code: Yup.string().required("Postal code is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters"),
    agree: Yup.boolean().oneOf([true], "You must agree to continue"),
  });

  // ✅ Initial values
  const initialValues = {
    account_type: "",
    email: "",
    verifyEmail: "",
    first_name: "",
    last_name: "",
    company: "",
    postal_code: "",
    password: "",
    agree: false,
  };

  // ✅ Submit handler
  const handleSubmit = (values: typeof initialValues) => {
    const payload = {
      account_type: values.account_type,
      email: values.email,
      first_name: values.first_name,
      last_name: values.last_name,
      company: values.company,
      postal_code: values.postal_code,
      password: values.password,
    };
    mutation.mutate(payload);
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
          />
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

        {/* Formik Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange }) => (
            <Form className="space-y-4 text-left">
              {/* Account Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Who are you? <span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  name="account_type"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2244]"
                >
                  <option value="">Select an Account Type</option>
                  <option value="Contractor">Contractor</option>
                  <option value="Distributor">Distributor</option>
                  <option value="Homeowner">Homeowner</option>
                  <option value="Property_Owner">Property Owner</option>
                  <option value="Specifier">Specifier</option>
                  <option value="Architect">Architect</option>
                  <option value="Insurance_Agent">Insurance Agent</option>
                  <option value="Other">Other</option>
                </Field>
                <ErrorMessage
                  name="account_type"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Field
                  type="email"
                  name="email"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2244]"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Verify Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verify Email Address <span className="text-red-500">*</span>
                </label>
                <Field
                  type="email"
                  name="verifyEmail"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2244]"
                />
                <ErrorMessage
                  name="verifyEmail"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  name="first_name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2244]"
                />
                <ErrorMessage
                  name="first_name"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  name="last_name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2244]"
                />
                <ErrorMessage
                  name="last_name"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <Field
                  type="text"
                  name="company"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2244]"
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  name="postal_code"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2244]"
                />
                <ErrorMessage
                  name="postal_code"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2244]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="cursor-pointer absolute right-2 top-2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

              <div className="text-xs text-gray-600 space-y-2 max-h-[120px] overflow-y-auto  p-2 rounded-md">
                <p>
                  By checking the box below and clicking the CREATE ACCOUNT
                  button:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    You accept and hereby electronically sign the Roofing
                    Privacy Policy and Terms of Use.
                  </li>
                  <li>
                    You consent to Roofing using your information to provide
                    services and updates.
                  </li>
                  <li>
                    You confirm you have read and understood the agreement.
                  </li>
                </ul>
              </div>

              {/* Agreement */}
              <div className="flex items-center space-x-2">
                <Field
                  id="agree"
                  type="checkbox"
                  name="agree"
                  className="h-4 w-4 text-[#0B2244] border-gray-300 rounded focus:ring-[#0B2244]"
                />
                <label
                  htmlFor="agree"
                  className="text-sm cursor-pointer text-gray-700"
                >
                  I AGREE
                </label>
              </div>

              <ErrorMessage
                name="agree"
                component="div"
                className="text-red-500 text-xs mt-1"
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={mutation.isPending}
                className={`w-full cursor-pointer py-2 rounded-md text-white text-sm font-medium transition ${
                  mutation.isPending
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#0B2244] hover:bg-[#132c57]"
                }`}
              >
                {mutation.isPending ? "Creating Account..." : "CREATE ACCOUNT"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignUp;
