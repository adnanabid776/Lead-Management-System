// src/pages/Login.jsx
// import React, { useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { login as loginApi } from "../api/auth";
// import { AuthContext } from "../Context/AuthContext";
// // import { toast } from "react-toastify";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [err, setErr] = useState(null);
//   const { login, user } = useContext(AuthContext);
//   const nav = useNavigate();
//   const [loginAs, setLoginAs] = useState("user");

//   // Redirect if already logged in
//   useEffect(() => {
//     if (err) {
//       const timer = setTimeout(() => {
//         setErr(null);
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//     if (user) {
//       nav("/", { replace: true });
//     }
//   }, [user, nav, err]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErr(null);

//     try {
//       const res = await loginApi({ email, password });
//       const token = res.data.token;
//       const userData = res.data.user;

//       //     if (loginAs === "admin" && userData.role !== "admin") {
//       //   return setErr("Only admins can log in using 'Login as Admin'.");
//       // }

//       // if (loginAs === "user" && userData.role === "admin") {
//       //   return setErr("Admins cannot log in using 'Login as User'.");
//       // }

//       if (loginAs === "admin" && userData.role !== "admin") {
//         return setErr("Only Admins can login!!!!");
//       }

//       if (loginAs === "user" && userData.role === "admin") {
//         return setErr("Only Users can login!!!!");
//       }

//       login(token, userData);
//       nav("/");
//     } catch (error) {
//       setErr(error?.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-[#0473EA]">
//       <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
//         Lead Management System
//       </h1>

//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 flex flex-col items-center justify-center gap-4 rounded shadow-2xl border border-[#0473EA] w-96 h-[70vh]"
//       >
//         <h2 className="text-2xl sm:text-3xl text-[#0473EA] font-bold mb-4 sm:-mt-10">
//           Login
//         </h2>
//         {err && (
//           <div className="mb-2 text-red-600 transition-all duration-300">
//             {err}
//           </div>
//         )}
//         <input
//           className="w-full p-2 border mb-3 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0473EA] text-md font-md text-[#0473EA]"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           className="w-full p-2 border mb-3 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0473EA] text-md font-md text-[#0473EA]"
//           placeholder="Password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button className="w-full p-2 rounded bg-[#0473EA] text-white focus:outline-none focus:ring-2 focus:ring-[#0473EA] hover:opacity-90 cursor-pointer transition-all duration-300">
//           Login
//         </button>

//         <div className="flex gap-4">
//           <button
//             type="button"
//             onClick={() => setLoginAs("user")}
//             className={`px-6 py-2 rounded ${
//               loginAs === "user" ? "bg-[#0473EA] text-white" : "bg-gray-200"
//             }`}
//           >
//             Login as User
//           </button>
//           <button
//             type="button"
//             onClick={() => setLoginAs("admin")}
//             className={`px-6 py-2 rounded ${
//               loginAs === "admin" ? "bg-[#0473EA] text-white" : "bg-gray-200"
//             }`}
//           >
//             Login as Admin
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// src/pages/Login.jsx
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../api/auth";
import { AuthContext } from "../Context/AuthContext";
import { toast } from "react-toastify"; // <-- ADDED

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const { login, user } = useContext(AuthContext);
  const nav = useNavigate();
  const [loginAs, setLoginAs] = useState("user");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      nav("/", { replace: true });
    }
  }, [user, nav]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);

    try {
      const res = await loginApi({ email, password });
      const token = res.data.token;
      const userData = res.data.user;

      // Role validation
      if (loginAs === "admin" && userData.role !== "admin") {
        toast.error("Only Admins can login!"); // <-- TOAST
        return;
      }

      if (loginAs === "user" && userData.role === "admin") {
        toast.error("Only Users can login!"); // <-- TOAST
        return;
      }

      // Success
      login(token, userData);
      toast.success("Login successful!"); // <-- TOAST

      nav("/");
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed";
      setErr(message);
      toast.error(message); // <-- TOAST
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0473EA]">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
        Lead Management System
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 flex flex-col items-center justify-center gap-4 rounded shadow-2xl border border-[#0473EA] w-96 h-[70vh]"
      >
        <h2 className="text-2xl sm:text-3xl text-[#0473EA] font-bold mb-4 sm:-mt-10">
          Login
        </h2>

        {/* {err && (
          <div className="mb-2 text-red-600 transition-all duration-300">
            {err}
          </div>
        )} */}

        <input
          className="w-full p-2 border mb-3 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0473EA] text-md font-md text-[#0473EA]"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full p-2 border mb-3 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0473EA] text-md font-md text-[#0473EA]"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full p-2 rounded bg-[#0473EA] text-white focus:outline-none focus:ring-2 focus:ring-[#0473EA] hover:opacity-90 cursor-pointer transition-all duration-300">
          Login
        </button>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setLoginAs("user")}
            className={`px-6 py-2 rounded ${
              loginAs === "user" ? "bg-[#0473EA] text-white" : "bg-gray-200"
            }`}
          >
            Login as User
          </button>

          <button
            type="button"
            onClick={() => setLoginAs("admin")}
            className={`px-6 py-2 rounded ${
              loginAs === "admin" ? "bg-[#0473EA] text-white" : "bg-gray-200"
            }`}
          >
            Login as Admin
          </button>
        </div>
      </form>
    </div>
  );
}
