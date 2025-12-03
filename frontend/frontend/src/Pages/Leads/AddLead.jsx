// src/pages/Leads/AddLead.jsx
import React, { useState } from "react";
import { createLead } from "../../api/leads";
import { useNavigate } from "react-router-dom";

export default function AddLead() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    notes: "",
  });
  const [err, setErr] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createLead(form);
      nav("/leads");
    } catch (error) {
      setErr(error?.response?.data?.message || "Error creating lead");
    }
  };

  return (
    <div className="max-w-2xl bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">Add Lead</h2>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          placeholder="Source"
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
          className="p-2 border rounded"
        />
        <textarea
          placeholder="Note"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="p-2 border rounded resize-none"
        />
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-[linear-gradient(90deg,#0473EA,#38D200)] text-white rounded hover:opacity-90 transition-opacity">
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
