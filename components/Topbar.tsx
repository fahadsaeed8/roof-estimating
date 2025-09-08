"use client";
import React from "react";
import Button from "./CustomButton";
import Link from "next/link";

interface TopBarProps {
  hidden?: boolean;
}

const Topbar: React.FC<TopBarProps> = () => {
  return (
    <div className="w-full bg-gradient-to-r from-[#5a5d2f] to-[#2d394b] text-white text-sm font-sans fixed top-0 left-0 z-50">
      <div className="flex items-center justify-between pl-20 pr-35 py-4">
        {/* Left Social Icons */}
        <div className="flex gap-5 px-5 text-white text-[18px]">
          <p>+1(800)646-6270</p>
        </div>

        {/* Right Language Selector */}
        <div className="flex gap-8">
          <Link
            className="flex hover:text-gray-300 items-center text-[20px] gap-2 cursor-pointer"
            href={"/login"}
          >
            Login
          </Link>

          <Button>Start Now</Button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
