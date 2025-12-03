// src/pages/Appointments/AddAppointment.jsx
import React, { useState, useEffect } from "react";
import { createAppointment } from "../../api/appointments";
import { getLeads } from "../../api/leads";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export default function AddAppointment() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    leadEmail: "",
    date: "",
    mode: "call",
    notes: "",
  });
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const loadLeads = async () => {
      try {
        const res = await getLeads();
        setLeads(res.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    loadLeads();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    try {
      await createAppointment(form);
      nav("/appointments");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to create appointment");
    }
  };
  return (
    <div className="max-w-xl bg-white p-6 rounded shadow">
      <h2 className="text-lg mb-4">Create Appointment</h2>
      <form onSubmit={submit} className="space-y-3">
        <select
          value={form.leadEmail}
          onChange={(e) => setForm({ ...form, leadEmail: e.target.value })}
          className="p-2 border rounded w-full"
          required
        >
          <option value="">Select a Lead</option>
          {leads.map((lead) => (
            <option key={lead._id} value={lead.email}>
              {lead.name} - {lead.email}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="p-2 border rounded w-full"
          required
        />
        <select
          value={form.mode}
          onChange={(e) => setForm({ ...form, mode: e.target.value })}
          className="p-2 border rounded w-full"
        >
          <option value="call">Call</option>
          <option value="online meeting">Online Meeting</option>
          <option value="sms">SMS</option>
          <option value="email">Email</option>
        </select>
        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="p-2 border rounded w-full"
        />
        <button className="px-8 py-2 bg-[#38D200] text-white rounded hover:opacity-90 transition-opacity">
          Create
        </button>
      </form>
    </div>
  );
}
