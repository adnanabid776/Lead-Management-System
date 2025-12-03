

// src/pages/Dashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import { getLeads } from "../api/leads";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { getAppointments } from "../api/appointments";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    won: 0,
    lost: 0,
    contacted: 0,
    inProgress: 0,
  });

  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [leads, setLeads] = useState([]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await getAppointments();
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.appointments || [];

      setAppointments(data.slice(0, 6));
    } catch (err) {
      console.error(err);
    }
  };

  const loadLeads = async () => {
    try {
      const res = await getLeads();
      const data = Array.isArray(res.data) ? res.data : res.data?.leads || [];

      setLeads(data.slice(0, 6));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      if (user?.role === "admin" || user?.role === 'manager') loadAppointments();
      if (user?.role === "admin" || user?.role === "agent" || user?.role === 'manager') loadLeads();

      setLoading(true);

      try {
        const res = await getLeads();
        const leads = res.data || [];

        setCounts({
          total: leads.length,
          pending: leads.filter((l) => l.status === "new").length,
          won: leads.filter((l) => l.status === "won").length,
          lost: leads.filter((l) => l.status === "lost").length,
          contacted: leads.filter((l) => l.status === "contacted").length,
          inProgress: leads.filter((l) => l.status === "in_progress").length,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) loadDashboard();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="">
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold mb-6 text-[#0F172A]relative inline-block">
        Dashboard
        {/* <span className="absolute left-0 -bottom-1 w-full h-1 rounded bg-[linear-gradient(90deg,#0473EA,#38D200)]"></span> */}
      </h1>

      {/* SUMMARY CARDS */}
      {(user?.role === "admin" || user?.role === "manager") && (
        <div className="grid  grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card title="Total Leads" value={counts.total} />
          <Card title="Pending" value={counts.pending} />
          <Card title="Contacted" value={counts.contacted} />
          <Card title="In Progress" value={counts.inProgress} />
          <Card title="Won" value={counts.won} />
          <Card title="Lost" value={counts.lost} />
        </div>
      )}

      {user?.role === "agent" && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card title="Total Leads" value={counts.total} />
          <Card title="Contacted" value={counts.contacted} />
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="mt-6 flex gap-3">
        {user?.role === "agent" && (
          <Link
            className="px-5 py-2 rounded text-white font-medium 
              bg-[#38D200] 
              hover:opacity-90 transition-all"
            to="/leads/add"
          >
            Add Lead
          </Link>
        )}

        {user?.role === "admin" && (
          <Link
            className="px-5 py-2 rounded text-white font-medium 
              bg-[#38D200]  
              hover:opacity-90 transition-all"
            to="/users"
          >
            Manage Users
          </Link>
        )}
      </div>

      {/* APPOINTMENTS SECTION */}
      {(user?.role === "manager" || user?.role === "admin") && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-[0F172A]">
              Upcoming Appointments
            </h2>
            <Link
              className="text-sm underline hover:text-gray-900 transition"
              to="/appointments"
            >
              View All Appointments
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {appointments.length === 0 ? (
              <div className="text-gray-500">No appointments found.</div>
            ) : (
              appointments.map((a) => (
                <div
                  key={a._id}
                  className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 flex flex-col gap-2 relative"
                >
                  {/* Gradient Border Strip */}
                  <div
                    className="absolute left-0 top-0 h-full w-1 rounded-l-xl 
                    bg-[linear-gradient(180deg,#0473EA,#38D200)]"
                  ></div>

                  <div className="font-semibold text-gray-800">
                    {a.lead?.name || a.lead?.email || "No Lead Email"}
                  </div>

                  <div className="text-sm text-gray-500">
                    {new Date(a.date).toLocaleString()}
                  </div>

                  <span className="self-start px-2 py-1 text-sm rounded bg-gray-100 capitalize">
                    {a.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* LEADS SECTION */}
      {(user?.role === "admin" || user?.role === "agent") && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-[#0F172A]">Upcoming Leads</h2>
            <Link
              className="text-sm underline text-[#0F172A] hover:text-gray-900 transition"
              to="/leads"
            >
              View All Leads
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.length === 0 ? (
              <div className="text-gray-500">No leads found.</div>
            ) : (
              leads.map((l) => (
                <div
                  key={l._id}
                  className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 flex flex-col gap-2 relative"
                >
                  {/* Gradient Border Strip */}
                  <div
                    className="absolute left-0 top-0 h-full w-1 rounded-l-xl 
                    bg-[linear-gradient(180deg,#0473EA,#38D200)]"
                  ></div>

                  <div className="font-semibold text-gray-800">
                    {l.name || "No Lead Name"}
                  </div>

                  <div className="text-sm text-gray-500">{l.email}</div>

                  <span className="self-start px-2 py-1 text-sm rounded bg-gray-100 capitalize">
                    {l.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* CARD COMPONENT */
function Card({ title, value }) {
  return (
    <div className="relative bg-white p-4 rounded-xl shadow border border-gray-100 text-center">
      <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl 
      bg-[linear-gradient(180deg,#0473EA,#38D200)]"
      ></div>

      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
  );
}
