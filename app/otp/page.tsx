"use client";
import Image from "next/image";
import { useState } from "react";

export default function OTPVerification() {
  const [otp, setOtp] = useState("");

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
            <span className="text-2xl">• • • •</span>
          </div>
          <span className="absolute right-18 -top-7 text-2xl font-bold text-gray-500">
            ?
          </span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-[#0B2244] mb-2">Enter OTP</h2>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-6">
          We have sent a 4-digit code to your email.
          <br />
          Please enter it below to verify your account.
        </p>

        {/* OTP input */}
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={4}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2244] text-center tracking-widest"
        />

        {/* Button */}
        <button
          disabled={otp.length !== 4}
          className={`w-full py-2 mt-5 cursor-pointer rounded-md text-white text-sm font-medium transition 
            ${
              otp.length === 4
                ? "bg-[#0B2244] hover:bg-[#132c57]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
}
