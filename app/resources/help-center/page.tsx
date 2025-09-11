import React from "react";

const HelpCenter = () => {
  return (
    <div className="bg-[#f8fcf4]">
      <div className="bg-[#05374c] h-[85vh]">
        <div className=" relative">
          <div className="flex justify-end">
            <img src="/house.png" alt="" className=" h-[80vh] object-contain" />
          </div>
          <h1 className=" text-2xl sm:text-[50px] font-[800] leading-[59px] text-white absolute top-[10%] md:top-[25%] left-[8%] ">
            The Help Center <br /> Your{" "}
            <span className="text-[#2bc7e9]">One-Stop</span> Support Hub
          </h1>
          <p className=" text-2xl sm:text-[36px] text-white absolute top-[40%] md:top-[60%] left-[8%]  leading-none">
            Less time on paperwork,
            <br /> more time on roofs
          </p>
          <div className="flex items-center justify-center absolute top-[75%] lg:top-[70%] xl:top-[84%] left-[8%]">
            <button className="bg-gradient-to-b from-[#92c86e] to-[#52a577] text-white text-xl font-bold w-[217px] h-[44px] flex items-center justify-center rounded-md">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
      <section>
        <div className="flex items-center justify-center">
          <h1 className=" text-[35px] font-bold">
            How can we{" "}
            <span className="text-[#2bc7e9] ">help?</span>
          </h1>
        </div>
        <div>
            <div className=" bg-white rounded-md shadow-[0_0_10px_rgba(0,0,0,0.1)] w-fit p-4 flex flex-col items-start justify-center">
                <h1 className=" text-lg font-bold">Understanding Your Subscription Options</h1>
                <p className=" ">Explore plans, upgrades, and our free trial</p>
            </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenter;
