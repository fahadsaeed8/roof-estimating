import React from "react";

const About = () => {
  return (
    <div className="bg-[#f8fcf4]">
      <section>
        <div className="relative">
          <img src="/about1.png" alt="" className="bg-[#1e475a]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 className="text-[50px] font-bold text-white">About Us</h1>
            <p className=" text-[30px] font-bold text-white w-[30%] mx-auto text-center mt-5 leading-none">
              Technology isn’t just a tool,{" "}
              <span className="text-[#2bc7e9]">it’s our vision .</span>
            </p>
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center justify-center w-[80%] text-center mx-auto my-20">
        <h1 className=" text-[35px] font-bold">
          <span className="text-[#2bc7e9]">Who</span> We Are
        </h1>
        <p className="mt-14 text-xl font-semibold text-gray-800">
          In 2012, a visionary architect, a seasoned building materials
          distributor, and a skilled IT expert came together with one goal in
          mind—reshape the construction industry. What began as a bold idea soon
          turned into a mission: to revolutionize roofing through innovative
          technology that simplifies challenges and promotes sustainability.
          From this vision, iRoofing was born, designed to redefine how projects
          are planned, managed, and completed. With powerful yet affordable
          tools, we empower professionals to work smarter, faster, and more
          efficiently—transforming roofing from start to finish.
        </p>
        <div className="w-[750px] h-[263px] flex bg-white shadow-2xl rounded-2xl my-20">
          <div className=" flex flex-col items-center justify-center gap-5 text-center px-10">
            <p className=" text-lg font-semibold text-shadow-gray-800">
              We started iRoofing because we wanted to offer something both
              affordable and user-friendly – something we’d actually use
              ourselves. So, we said goodbye to crazy fees, expensive contracts,
              and all that other nonsense. It’s just better this way.
            </p>
            <h1 className=" text-xl font-bold">
              Daniel Meridor, CEO & Co Founder
            </h1>
          </div>
          <div className=" w-full">
            <img
              src="/aboutman.jpg"
              alt=""
              className="w-[232px] h-[263px] rounded-r-2xl object-cover"
            />
          </div>
        </div>
      </section>
      <div className="bg-[#05374c]">
        <div className=" relative">
          <img src="/grid.png" alt="" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 className=" text-[35px] font-bold text-white">
              <span className="text-[#2bc7e9] ">Who</span> We Are
            </h1>
            <img src="/pcimage.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
