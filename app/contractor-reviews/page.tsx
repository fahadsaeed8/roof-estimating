import React from "react";

const ContractorReview = () => {
  return (
    <div>
      <div className="bg-[#05374c] h-screen">
        <div className=" relative">
          <img src="/grid.png" alt="" />
          <h1 className=" text-[50px] font-[800] leading-[59px] text-white absolute top-[25%] left-[8%] w-[50%]">
            {" "}
            <span className="text-[#2bc7e9]">Real Reviews</span> from
            Professional Roofers
          </h1>
          <p className=" text-[36px] text-white absolute top-[59%] left-[8%] w-[40%]">We raise the roof with our customer support.</p>
        </div>
      </div>
    </div>
  );
};

export default ContractorReview;
