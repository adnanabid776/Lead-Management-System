import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Navigate = () => {
  const nav = useNavigate();
  const location = useLocation();

  if (location.pathname === "/") return null;

  return (
    <div className="mb-6">
      <span
        className="bg-white rounded-full text-[#0473EA] px-3 py-1 text-xl mx-1 cursor-pointer font-bold shadow-xl hover:bg-[linear-gradient(90deg,#0473EA,#38D200)] hover:text-white hover:border-none transition-all duration-300"
        onClick={() => nav(-1)}
      >
        &lt;
      </span>
      <span
        className="bg-white rounded-full text-[#0473EA] px-3 py-1 text-xl mx-1 cursor-pointer font-bold shadow-xl hover:bg-[linear-gradient(90deg,#0473EA,#38D200)] hover:text-white hover:border-none transition-all duration-300"
        onClick={() => nav(1)}
      >
        &gt;
      </span>
    </div>
  );
};

export default Navigate;
