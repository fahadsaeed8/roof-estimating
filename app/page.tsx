"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import React, { useState } from "react";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Header isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <HeroSection />
      <Footer />
    </div>
  );
};

export default Page;
