
// import React, { useEffect, useState } from "react";
// import { my_agents } from "../api/users";
// import api from "../api/axios";
// import { toast } from 'react-toastify';

// export default function AssignModal({ leadId, onClose, onSuccess }) {
//   const [agents, setAgents] = useState([]);
//   const [agentId, setAgentId] = useState("");
//   const [loading, setLoading] = useState(true);

//   // Load manager's agents
//   useEffect(() => {
//     const loadAgents = async () => {
//       try {
//         const res = await my_agents();

//         const received = res.data?.agents || res.data || [];

//         setAgents(Array.isArray(received) ? received : []);
//       } catch (error) {
//         toast.error("Failed to load agents:", error);
//         setAgents([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadAgents();
//   }, []);

//   const handleAssign = async () => {
//     if (!agentId) {
//       toast("Please select an agent.");
//       return;
//     }

//     try {
//       await api.post("/leads/assign", {
//         leadId, // backend must support array
//         agentId,
//       });

//       onSuccess();
//     } catch (err) {
//       toast.error(err);
//       toast("Assignment failed.");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-100 bg-opacity-90 flex justify-center items-center">
//       <div className="bg-white p-6 rounded w-96">
//         <h3 className="text-lg font-bold mb-4">Assign Leads</h3>

//         {loading ? (
//           <p>Loading agents...</p>
//         ) : agents.length === 0 ? (
//           <p className="text-red-500">No agents found under you.</p>
//         ) : (
//           <>
//             <label className="mb-1 block font-semibold">Select Agent</label>

//             <select
//               className="w-full border px-2 py-2 rounded mt-1"
//               value={agentId}
//               onChange={(e) => setAgentId(e.target.value)}
//             >
//               <option value="">-- Select Agent --</option>

//               {agents.map((agent) => (
//                 <option key={agent._id} value={agent._id}>
//                   {agent.name}
//                 </option>
//               ))}
//             </select>
//           </>
//         )}

//         <div className="mt-4 flex justify-between">
//           <button className="bg-gray-300 px-3 py-1 rounded" onClick={onClose}>
//             Cancel
//           </button>

//           <button
//             className="bg-[linear-gradient(90deg,#0473EA,#38D200)] text-white px-3 py-1 rounded hover:opacity-90 transition-opacity"
//             disabled={loading || agents.length === 0}
//             onClick={handleAssign}
//           >
//             Assign
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
