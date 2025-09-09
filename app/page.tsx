"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React, { useState } from "react";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Header isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <Footer />
    </div>
  );
};

export default Page;
