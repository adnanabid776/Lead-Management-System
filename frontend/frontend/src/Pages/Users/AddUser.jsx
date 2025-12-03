
// src/pages/Users/AddUser.jsx
import React, { useState, useEffect } from "react";
import { createUser, managers } from "../../api/users";
import { useNavigate } from "react-router-dom";

export default function AddUser() {
  const nav = useNavigate();
  const [managerList, setManagerList] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",        // start with no role selected -> shows placeholder
    managerId: "",
  });

  const [err, setErr] = useState(null);

  // Load managers once
  useEffect(() => {
    async function loadManagers() {
      try {
        const res = await managers();
        setManagerList(res.data || []);
      } catch (error) {
        console.log("Error loading managers:", error);
      }
    }

    loadManagers();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);

    // Validate: must pick a role
    if (!form.role) {
      return setErr("Please select a role (select an agent or a manager).");
    }

    // Validate: if role is agent, manager must be selected
    if (form.role === "agent" && !form.managerId) {
      // Using the wording you asked for: "select an agent" -> clarify to select manager for agent
      return setErr("Please select a manager for this agent.");
    }

    try {
      await createUser(form);
      nav("/users");
    } catch (e) {
      setErr(e?.response?.data?.message || "Error creating user");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-md">
      <h2 className="text-xl mb-4 text-primary font-semibold">Create User</h2>

      {err && <div className="text-red-600 mb-2">{err}</div>}

      <form onSubmit={submit} className="space-y-3">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="p-2 border rounded w-full"
          required
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="p-2 border rounded w-full"
          required
        />

        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="p-2 border rounded w-full"
          required
        />

        {/* ROLE DROPDOWN: placeholder as default */}
        <select
          value={form.role}
          onChange={(e) => {
            const role = e.target.value;
            setForm({
              ...form,
              role,
              // reset managerId when switching away from agent
              managerId: role === "agent" ? "" : null,
            });
            setErr(null);
          }}
          className="p-2 border rounded w-full"
        >
          <option value="" disabled>
            Select role
          </option>
          <option value="agent">Agent</option>
          <option value="manager">Manager</option>
        </select>

        {/* MANAGER SELECTION (ONLY WHEN ROLE = AGENT) */}
        {form.role === "agent" && (
          <select
            value={form.managerId}
            onChange={(e) => {
              setForm({ ...form, managerId: e.target.value });
              setErr(null);
            }}
            className="p-2 border rounded w-full"
            required={form.role === "agent"}
          >
            <option value="" disabled>
              Select manager
            </option>
            {managerList.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
        )}

        <button className="px-4 py-2 bg-[#38D200] text-white rounded hover:opacity-90 transition-opacity">
          Create
        </button>
      </form>
    </div>
  );
}
