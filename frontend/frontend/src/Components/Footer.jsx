import React from "react";

const Footer = () => {
  return (
    // <div className=" bg-[#0473EA] flex flex-col items-center justify-center text-white text-shadow-black font-semibold text-md pt-2 pb-2">
    <div
      className="bg-[#0473EA] flex flex-col items-center justify-center text-white  font-semibold text-md pt-2 pb-2"
      style={{ boxShadow: "0px 0px 10px rgba(0,0,0,0.4)" }}
    >
      <p>
        {" "}
        <span className="">Copyright </span>&copy; 2025 - All Right Reserved
      </p>
      <p>
        Developed by{" "}
        <span className="text-black font-bold cursor-pointer hover:text-[#0F172A] transition-all duration-300">
          Junaid{" "}
        </span>
        and{" "}
        <span className="text-black font-bold hover:text-[#0F172A] transition-all duration-300 cursor-pointer">
          Adnan
        </span>
        .
      </p>
    </div>
  );
};

export default Footer;
