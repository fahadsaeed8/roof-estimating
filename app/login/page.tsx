"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex pt-[75px] flex-col md:flex-row bg-white">
      {/* Left Section */}
      <div className="flex-1 flex justify-center items-center bg-[#0c2340] px-6 py-10">
        <div className="bg-white w-full max-w-md rounded-lg shadow p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image src="/Logo.png" alt="iRoofing" width={150} height={40} />
          </div>

          <h2 className="text-center font-medium mb-6">
            Enter Your Email To Login
          </h2>

          {/* Login Form */}
          <form className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-gray-400 focus:outline-none focus:border-blue-600 py-2"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-gray-400 focus:outline-none focus:border-blue-600 py-2"
              />
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4" />
                Remember Me
              </label>
              <a href="#" className="text-blue-700 hover:underline">
                Forgot Password
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 bg-white border border-gray-600 text-black py-2 rounded hover:bg-gray-100"
            >
              Sign In →
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-center text-sm mt-4">
            Not A Member?{" "}
            <a href="#" className="text-blue-700 hover:underline">
              Sign Up Now
            </a>
          </p>

          {/* Roof Report Box */}
          <div className="bg-gradient-to-r from-[#123c54] to-[#25606a] text-white mt-6 p-4 rounded">
            <h3 className="text-[#c6f414] font-bold text-lg">
              Need A Roof Report?
            </h3>
            <p className="text-sm mt-1">
              No subscription needed! Order low-cost precise roof measurement
              reports in just a few clicks—quick, accurate, and hassle-free.
            </p>
            <button className="bg-[#c6f414] text-black px-5 py-2 mt-4 rounded font-medium hover:bg-lime-400">
              Order Now!
            </button>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-10">
        <Image
          src="/roof-screenshot.png"
          alt="Roof Measurement"
          width={600}
          height={400}
          className="rounded shadow"
        />

        <div className="text-center mt-8 max-w-lg">
          <h2 className="text-2xl font-bold text-gray-800">
            Unlimited Measurement Reports
          </h2>
          <p className="text-gray-600 mt-3">
            Create unlimited, detailed roof measurement reports from your
            desktop PC using the app’s satellite imagery. Then, share any report
            by saving and sending it as a PDF.
          </p>
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">
          *ALL PLANS INCLUDE ACCESS FOR 3 DEVICES + FREE, UNLIMITED TRAINING AND
          SUPPORT!
        </p>
      </div>
    </div>
  );
}
