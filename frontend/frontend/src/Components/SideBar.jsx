// src/components/Sidebar.jsx
// import React, { useContext, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { AuthContext } from "../Context/AuthContext";

// import hamburger_menu from "../assets/burger-menu-icon.svg";
// import dashboard_icon from "../assets/dashboard_icon.svg";
// import leads_icon from "../assets/leads_icon.svg";
// import user_icon from "../assets/user_icon.svg";
// import appointment_icon from "../assets/appointment_icon.svg";
// import leads from '../assets/leads.svg'

// export default function Sidebar({ menu, setMenu }) {
//   const { user } = useContext(AuthContext);
//   const role = user?.role;
//   const { pathname } = useLocation();

//   const handleLinkClick =() =>{
//     if(window.innerWidth < 640){
//       setMenu(false);
//     }
//   };

//   useEffect(()=>{
//     const handleSizes = ()=>{
//       if(window.innerWidth < 640){
//         setMenu(false);
//       }else{
//         setMenu(true);
//       }
//     }
//     handleSizes();
//     window.addEventListener('resize', handleSizes);
//       return () => window.removeEventListener("resize", handleSizes);
//   },[setMenu])

//   const linkClasses = (path) =>
//     `flex items-center gap-3 p-3 rounded-xl mx-2 transition-all duration-300
//      ${pathname === path ? "bg-white/20 shadow-sm" : "hover:bg-white/10"}`;

//   return (
//     <aside
//     className={`
//         bg-[linear-gradient(135deg,rgba(4,115,234,1),rgba(56,210,0,1))]
//       text-white transition-all duration-300 py-4 shadow-xl
//     min-h-screen
//     ${
//       menu
//         ? "w-64"                            // Expanded width for ALL screens when menu = true
//         : "w-16"                            // Collapsed width for ALL screens when menu = false
//     }
//     ${
//       menu
//         ? "max-sm:fixed max-sm:top-0 max-sm:left-0 max-sm:z-20 max-sm:h-screen max-sm:w-full"
//         : ""
//     }

//     ${menu ? "":"max-sm:w-16"}             // Mobile collapsed default
//   `}
//     >
//       {/* LOGO + TOGGLE */}
//       <div className={`flex items-center ${menu ? "px-6 justify-between" : "justify-center"} mb-6`}>
//         {menu && <h1 className="text-3xl font-extrabold tracking-wide">LMS</h1>}

//         <img
//           src={hamburger_menu}
//           className="w-8 cursor-pointer"
//           onClick={() => setMenu(!menu)}
//           alt=""
//         />
//       </div>

//       {/* NAV LINKS */}
//       <nav className="flex flex-col gap-2">
//         <Link to="/" onClick={handleLinkClick} className={linkClasses("/")}>
//           <img src={dashboard_icon} className="w-7" />
//           {menu && <span>Dashboard</span>}
//         </Link>

//         <Link to="/leads" onClick={handleLinkClick} className={linkClasses("/leads")}>
//           <img src={leads} className="w-7" />
//           {menu && <span>Leads</span>}
//         </Link>

//         {role === "admin" && (
//           <Link to="/users" onClick={handleLinkClick} className={linkClasses("/users")}>
//             <img src={user_icon} className="w-7" />
//             {menu && <span>Users</span>}
//           </Link>
//         )}

//         {(role === "manager" || role === "admin" || role === 'agent') && (
//           <Link to="/appointments" onClick={handleLinkClick} className={linkClasses("/appointments")}>
//             <img src={appointment_icon} className="w-7" />
//             {menu && <span>Appointments</span>}
//           </Link>
//         )}
//         {(role === "manager" || role === "admin") && (
//           <Link to="/upload" onClick={handleLinkClick} className={linkClasses("/upload")}>
//             <img src={leads_icon} className="w-7" />
//             {menu && <span>Upload File</span>}
//           </Link>
//         )}
//       </nav>
//     </aside>
//   );
// }

// src/components/Sidebar.jsx
import React, { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

import hamburger_menu from "../assets/burger-menu-icon.svg";
import dashboard_icon from "../assets/dashboard_icon.svg";
import leads_icon from "../assets/leads_icon.svg";
import user_icon from "../assets/user_icon.svg";
import appointment_icon from "../assets/appointment_icon.svg";
import leads from "../assets/leads.svg";

export default function Sidebar({ menu, setMenu }) {
  const { user } = useContext(AuthContext);
  const role = user?.role;
  const { pathname } = useLocation();

  const handleLinkClick = () => {
    if (window.innerWidth < 640) {
      setMenu(false);
    }
  };

  useEffect(() => {
    const handleSizes = () => {
      if (window.innerWidth < 640) {
        setMenu(false);
      } else {
        setMenu(true);
      }
    };
    handleSizes();
    window.addEventListener("resize", handleSizes);
    return () => window.removeEventListener("resize", handleSizes);
  }, [setMenu]);

  // Combined style: transparent default, soft dark hover, white active
  const linkClasses = (path) =>
    `
      flex items-center gap-3 p-3 rounded-xl mx-2 transition-all duration-300
      text-white
    
      ${
        pathname === path
          ? "bg-white/20 backdrop-blur-sm shadow-sm" // ACTIVE → white/20 overlay
          : "hover:bg-black/20 hover:backdrop-blur-sm" // HOVER → dark translucent
      }
    `;

  return (
    <aside
      className={`
    bg-[#0473EA]
    text-white transition-all duration-300 py-4  min-h-screen
    ${menu ? "w-64" : "w-16"}
    ${
      menu
        ? "max-sm:fixed max-sm:top-0 max-sm:left-0 max-sm:z-20 max-sm:h-screen max-sm:w-full"
        : ""
    }
    ${menu ? "" : "max-sm:w-16"}
  `}
    >
      {/* HEADER STRIP (Option C) */}
      <div
        className={`
          flex items-center ${
            menu ? "px-6 justify-between" : "justify-center"
          } mb-6
          w-full py-3 rounded-b-xl 
          bg-[#0473EA]
          backdrop-blur-md
        `}
      >
        {menu && <h1 className="text-3xl font-extrabold tracking-wide">LMS</h1>}

        <img
          src={hamburger_menu}
          className="w-8 cursor-pointer"
          onClick={() => setMenu(!menu)}
          alt=""
        />
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-2">
        <Link to="/" onClick={handleLinkClick} className={linkClasses("/")}>
          <img src={dashboard_icon} className="w-7" />
          {menu && <span>Dashboard</span>}
        </Link>

        <Link
          to="/leads"
          onClick={handleLinkClick}
          className={linkClasses("/leads")}
        >
          <img src={leads} className="w-7" />
          {menu && <span>Leads</span>}
        </Link>

        {role === "admin" && (
          <Link
            to="/users"
            onClick={handleLinkClick}
            className={linkClasses("/users")}
          >
            <img src={user_icon} className="w-7" />
            {menu && <span>Users</span>}
          </Link>
        )}

        {(role === "manager" || role === "admin" || role === "agent") && (
          <Link
            to="/appointments"
            onClick={handleLinkClick}
            className={linkClasses("/appointments")}
          >
            <img src={appointment_icon} className="w-7" />
            {menu && <span>Appointments</span>}
          </Link>
        )}

        {(role === "manager" || role === "admin") && (
          <Link
            to="/upload"
            onClick={handleLinkClick}
            className={linkClasses("/upload")}
          >
            <img src={leads_icon} className="w-7" />
            {menu && <span>Upload File</span>}
          </Link>
        )}
      </nav>
    </aside>
  );
}
