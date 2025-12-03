// src/components/Header.jsx
import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

export default function Header({ menu, setMenu }) {
  const { user, logout } = useContext(AuthContext);
  return (
    <header
      className={`flex items-center relative justify-between p-4 pb-3 
  bg-[#0473EA]`}
    >
      <div className="text-2xl font-semibold text-white max-sm:text-xl max-sm:w-20">
        Welcome {user?.name || "User"}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-white uppercase font-bold">
          {user?.role}
        </div>
        <button
          onClick={logout}
          className="px-8 py-2 rounded bg-red-500 border hover:bg-transparent hover:text-white
      font-bold text-white text-sm transition-all duration-300 cursor-pointer max-sm:border-none max-sm:px-3 max-sm:py-1"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
