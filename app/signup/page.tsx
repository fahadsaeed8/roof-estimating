"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signupAPI } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First name is required"),
    middle_name: Yup.string(),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    verifyEmail: Yup.string()
      .oneOf([Yup.ref("email")], "Emails must match")
      .required("Please verify your email"),
    phone: Yup.string().required("Mobile number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    company: Yup.string(),
    postal_code: Yup.string().required("Postal code is required"),
    agree: Yup.boolean().oneOf([true], "You must agree to continue"),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: signupAPI,
    onSuccess: (data) => {
      toast.success(data?.message || "Account created successfully");
      router.push("/otp");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || "Signup failed");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0c2340] via-[#15385f] to-[#2a5869] px-3 py-12">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/Superior Pro Roofing logo black.png"
            alt="Superior Pro Roofing Logo"
            width={280}
            height={70}
            className="w-[220px] sm:w-[260px] h-auto drop-shadow-md"
            priority
          />
        </div>

        <h2 className="text-center text-2xl font-bold text-[#0c2340] mb-2">
          Create Your Account
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          Register to manage your roof projects and reports easily.
        </p>

        {/* Form */}
        <Formik
          initialValues={{
            first_name: "",
            middle_name: "",
            last_name: "",
            email: "",
            verifyEmail: "",
            phone: "",
            password: "",
            company: "",
            postal_code: "",
            agree: false,
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => mutate(values)}
        >
          {() => (
            <Form className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Field
                    name="first_name"
                    placeholder="First Name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-black placeholder-secondary focus:outline-none focus:ring-2 focus:ring-[#25606a]"
                  />
                  <ErrorMessage
                    name="first_name"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div>
                  <Field
                    name="middle_name"
                    placeholder="Middle Name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-black placeholder-secondary focus:outline-none focus:ring-2 focus:ring-[#25606a]"
                  />
                </div>
                <div>
                  <Field
                    name="last_name"
                    placeholder="Last Name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-black placeholder-secondary focus:outline-none focus:ring-2 focus:ring-[#25606a]"
                  />
                  <ErrorMessage
                    name="last_name"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-black placeholder-secondary focus:outline-none focus:ring-2 focus:ring-[#25606a]"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

              {/* Phone */}

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-6">
                <div>
                  <Field
                    type="number"
                    name="phone"
                    placeholder="Mobile Number"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-black placeholder-secondary focus:outline-none focus:ring-2 focus:ring-[#25606a]"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              {/* Password */}
              <div className="relative">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-black placeholder-secondary focus:outline-none focus:ring-2 focus:ring-[#25606a]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="cursor-pointer absolute right-3 top-2.5 text-gray-500"
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

              {/* Company */}
              <div>
                <Field
                  type="text"
                  name="company"
                  placeholder="Company Name (optional)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-black placeholder-secondary focus:outline-none focus:ring-2 focus:ring-[#25606a]"
                />
              </div>

              {/* Postal Code */}
              <div>
                <Field
                  type="text"
                  name="postal_code"
                  placeholder="Postal Code"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-black placeholder-secondary focus:outline-none focus:ring-2 focus:ring-[#25606a]"
                />
                <ErrorMessage
                  name="postal_code"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Agreement */}
              <div className="flex items-center gap-2">
                <Field
                  type="checkbox"
                  name="agree"
                  className="h-4 w-4 text-[#25606a] border-gray-300 rounded focus:ring-[#25606a]"
                />
                <label className="text-sm text-gray-800">
                  I agree to the Terms & Privacy Policy
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
                disabled={isPending}
                className={`w-full cursor-pointer py-3 rounded-md text-white text-sm font-semibold transition ${
                  isPending
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#25606a] to-[#2ea97d] hover:opacity-90"
                }`}
              >
                {isPending ? "Creating Account..." : "Create Account"}
              </button>

              <p className="text-center text-gray-700 text-sm mt-3">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:underline text-black"
                >
                  Login here
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
