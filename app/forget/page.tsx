"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSend = () => {
    if (email) {
      router.push("/otp");
    }
  };

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

        {/* Password illustration */}
        <div className="flex justify-center mb-12 -mt-12 relative">
          <div className="border bg-blue-100 border-gray-300 rounded-md px-8 py-2 flex items-center space-x-2">
            <span className="text-2xl">• • • • •</span>
          </div>
          <span className="absolute right-18 -top-7 text-2xl font-bold text-gray-500">
            ?
          </span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-[#0B2244] mb-2">
          Reset Password
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-6">
          Enter the email address you used to sign up and
          <br />
          we will send you a link to reset your password
        </p>

        {/* Email input */}
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2244]"
        />

        {/* Button */}
        <button
          disabled={!email}
          onClick={handleSend} // <-- added click handler
          className={`w-full py-2 mt-5 rounded-md text-white text-sm font-medium transition 
            ${
              email
                ? "bg-[#0B2244] hover:bg-[#132c57]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
        >
          Send Reset Instructions
        </button>
      </div>
    </div>
  );
}
