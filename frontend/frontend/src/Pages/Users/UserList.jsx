// src/pages/Users/UserList.jsx
import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, updateUser } from "../../api/users";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "" });

  const load = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete user?")) return;

    try {
      await deleteUser(id);
      load();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    }
  };

  const handleEdit = (user) => {
    setEditingId(user._id || user.id);
    setEditForm({ name: user.name, email: user.email, role: user.role });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", email: "", role: "" });
  };

  const handleSaveEdit = async (id) => {
    try {
      await updateUser(id, editForm);
      setEditingId(null);
      setEditForm({ name: "", email: "", role: "" });
      load();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center uppercase mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <Link
          to="/users/add"
          className="px-3 py-1 rounded text-white font-semibold bg-[#38D200] 
          hover:opacity-90 transition-all duration-300"
        >
          Add User
        </Link>
      </div>
      <div className="bg-white rounded shadow overflow-hidden max-sm:overflow-auto border border-border">
        <table className="w-full table-auto uppercase">
          <thead className="text-white bg-[#0473EA]">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody className="uppercase">
            {users.map((u) => {
              const userId = u._id || u.id;
              const isEditing = editingId === userId;

              return (
                <tr
                  key={userId}
                  className="border-t border-border hover:bg-light transition text-center text-sm"
                >
                  {isEditing ? (
                    <>
                      <td className="p-2">
                        <input
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="p-1 border rounded w-full"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                          className="p-1 border rounded w-full"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={editForm.role}
                          onChange={(e) =>
                            setEditForm({ ...editForm, role: e.target.value })
                          }
                          className="p-1 border rounded w-full"
                        >
                          <option value="agent">Agent</option>
                          <option value="manager">Manager</option>
                        </select>
                      </td>
                      <td className="p-2 uppercase">
                        <button
                          onClick={() => handleSaveEdit(userId)}
                          className="text-success mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-2 text-success font-semibold">
                        {u.name}
                      </td>
                      <td className="p-2 text-primary-light font-semibold">
                        {u.email}
                      </td>
                      <td className="p-2">{u.role}</td>
                      <td className="p-2">
                        {u.role !== "admin" && (
                          <div className="flex items-center justify-center gap-1 uppercase">
                            <button
                              onClick={() => handleEdit(u)}
                              className="text-primary uppercase mr-2 cursor-pointer hover:underline"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(userId)}
                              className="text-danger uppercase cursor-pointer hover:underline"
                            >
                              {" "}
                              Delete
                            </button>
                          </div>
                        )}
                        {u.role === "admin" && (
                          <span className="text-gray-400">No actions</span>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
