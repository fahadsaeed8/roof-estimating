"use client";

import Image from "next/image";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { resendOTPAPI, verifyOTPAPI } from "@/services/auth";

const OtpSchema = Yup.object().shape({
  otp: Yup.string()
    .required("OTP is required")
    .length(6, "OTP must be exactly 6 digits"),
});

export default function OTPVerification() {
  const router = useRouter();

  const verifyMutation = useMutation({
    mutationFn: (data: { email: string; otp: string }) => verifyOTPAPI(data),
    onSuccess: (data) => {
      toast.success(data?.message || "OTP verified successfully!");
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Invalid OTP");
    },
  });

  const resendMutation = useMutation({
    mutationFn: (data: { email: string }) => resendOTPAPI(data),
    onSuccess: (data) => {
      toast.success(data?.message || "OTP resent successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to resend OTP");
    },
  });

  // ✅ Get email from cookies
  const email = Cookies.get("signupemail");

  return (
    <div className="min-h-screen pt-[75px] flex items-center justify-center bg-[#0B2244]">
      <div className="bg-white rounded-md shadow-md p-10 w-[400px] text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/Black-Logo-main.png"
            alt="iRoofing Logo"
            width={320}
            height={40}
            className="-mt-10"
          />
        </div>

        {/* OTP illustration */}
        <div className="flex justify-center mb-12 -mt-12 relative">
          <div className="border bg-blue-100 border-gray-300 rounded-md px-8 py-2 flex items-center space-x-2">
            <span className="text-2xl">• • • • • •</span>
          </div>
          <span className="absolute right-18 -top-7 text-2xl font-bold text-gray-500">
            ?
          </span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-[#0B2244] mb-2">Enter OTP</h2>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-6">
          We have sent a 6-digit code to your email.
          <br />
          Please enter it below to verify your account.
        </p>

        {/* ✅ OTP Formik Form */}
        <Formik
          initialValues={{ otp: "" }}
          validationSchema={OtpSchema}
          onSubmit={(values) => {
            if (!email) {
              toast.error("Email not found. Please sign up again.");
              return;
            }
            verifyMutation.mutate({ email, otp: values.otp });
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* OTP input */}
              <Field
                type="text"
                name="otp"
                placeholder="Enter OTP"
                maxLength={6}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2244] text-center tracking-widest"
              />
              <ErrorMessage
                name="otp"
                component="div"
                className="text-red-500 text-sm mb-4"
              />

              {/* Verify Button */}
              <button
                type="submit"
                disabled={verifyMutation.isPending || isSubmitting}
                className={`w-full cursor-pointer py-2 mt-2 rounded-md text-white text-sm font-medium transition ${
                  verifyMutation.isPending || isSubmitting
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#0B2244] hover:bg-[#132c57]"
                }`}
              >
                {verifyMutation.isPending ? "Verifying..." : "Verify OTP"}
              </button>
            </Form>
          )}
        </Formik>

        {/* ✅ Resend OTP link */}
        <p className="text-sm text-gray-600 mt-4">
          Didn’t receive the code?{" "}
          <button
            type="button"
            onClick={() => {
              if (!email) {
                toast.error("Email not found. Please sign up again.");
                return;
              }
              resendMutation.mutate({ email });
            }}
            disabled={resendMutation.isPending}
            className="text-blue-600 cursor-pointer font-medium hover:underline disabled:opacity-50"
          >
            {resendMutation.isPending ? "Resending..." : "Resend OTP"}
          </button>
        </p>
      </div>
    </div>
  );
}
