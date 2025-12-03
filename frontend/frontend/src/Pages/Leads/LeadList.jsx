import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  getLeads,
  deleteLead,
  bulkAssign,
  bulkDeleteLeads,
} from "../../api/leads";
import { my_agents } from "../../api/users";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { toast } from 'react-toastify';

export default function LeadList() {
  const { user } = useContext(AuthContext);

  // Data
  const [allLeads, setAllLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 10;

  // Bulk selections
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);

  // Agents for dropdown
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");

  // const loadLeads = useCallback(async () => {
  //   setLoading(true);

  //   try {
  //     const res = await getLeads();
  //     setAllLeads(res.data || []);
  //   } catch (error) {
  //     console.error(error);
  //     setAllLeads([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);
  const loadLeads = useCallback(async () => {
    setLoading(true);

    try {
      const res = await getLeads();
      const leads = res.data || [];

      // 🔥 SORT HERE
      const sortedLeads = leads.sort((a, b) => {
        // 1️⃣ Unassigned first
        if (!a.assignedTo && b.assignedTo) return -1;
        if (a.assignedTo && !b.assignedTo) return 1;

        // 2️⃣ Newest first
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setAllLeads(sortedLeads);
    } catch (error) {
      toast.error(error);
      setAllLeads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  // Load agents
  useEffect(() => {
    if (user?.role === "admin" || user?.role === "manager") {
      my_agents()
        .then((res) => setAgents(res.data || []))
        .catch(() => setAgents([]));
    }
  }, [user]);

  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const isAgent = user?.role === "agent";

  // Pagination calculations
  const indexOfLast = currentPage * leadsPerPage;
  const indexOfFirst = indexOfLast - leadsPerPage;
  const currentLeads = allLeads.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(allLeads.length / leadsPerPage);

  // Select / Unselect single lead
  const toggleSelect = (id) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Select / Unselect all leads on current page
  const toggleSelectAll = () => {
    const currentPageIds = currentLeads.map((l) => l._id);

    const allSelected = currentPageIds.every((id) =>
      selectedLeadIds.includes(id)
    );

    if (allSelected) {
      // remove only current page IDs
      setSelectedLeadIds((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    } else {
      // add missing IDs
      setSelectedLeadIds((prev) => [
        ...prev,
        ...currentPageIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  //Bulk Deletion logic

  const handleBulkDelete = async () => {
    if (selectedLeadIds.length === 0) {
      toast.error("No leads selected");
      return;
    }

    if (!window.confirm("Delete selected leads?")) return;

    try {
      const res = await bulkDeleteLeads({ leadIds: selectedLeadIds });

      toast(res.data.message);

      // Remove deleted leads from UI
      setAllLeads((prev) =>
        prev.filter((lead) => !selectedLeadIds.includes(lead._id))
      );

      setSelectedLeadIds([]); // clear selection
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  // Bulk assign
  const handleBulkAssign = async () => {
    if (selectedLeadIds.length === 0) {
      toast.warning("No leads selected");
      return;
    }
    if (!selectedAgent) {
      toast.warning("Select an agent first");
      return;
    }

    try {
      await bulkAssign({
        leadIds: selectedLeadIds,
        agentId: selectedAgent,
      });

      toast.success("Bulk assign successful");
      setSelectedLeadIds([]);
      loadLeads();
    } catch (err) {
      toast.error(err);

      // 🔥 Show backend error message (Reassign not allowed)
      if (err?.response?.data?.message === "Reassign not allowed") {
        toast.warning("Reassign not allowed");
        return;
      }

      // 🔥 Show ANY other backend message
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
        return;
      }

      toast.error("Bulk assign failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this lead?")) return;

    try {
      await deleteLead(id);
      loadLeads();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete lead");
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 uppercase">
        <h1 className="text-2xl font-bold text-[#0F172A]">Leads</h1>
      </div>

      {/* Bulk Assign Bar */}
      {isManager && (
        <>
          <div className="flex items-center justify-between w-full gap-4 mb-4">
            <div className="flex items-center gap-4">
              <select
                className="border px-3 py-1 rounded text-gray-800 outline-none"
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
              >
                <option value="">Select Agent</option>
                {agents.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name}
                  </option>
                ))}
              </select>

              <button
                className="bg-[#38D200] text-white px-4 py-2 rounded hover:opacity-90 transition-opacity"
                onClick={handleBulkAssign}
              >
                Assign Selected
              </button>

              <span className="text-sm text-gray-700">
                Selected: {selectedLeadIds.length}
              </span>
            </div>
            {/* button  */}
            <div className="flex items-center gap-5">
              {isManager && (
                <Link
                  to="/leads/add"
                  className="px-5 py-2 text-white rounded bg-[#38D200] hover:opacity-90 transition-opacity"
                >
                  Add Lead
                </Link>
              )}
              <button
                className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors"
                disabled={selectedLeadIds.length === 0}
                onClick={handleBulkDelete}
              >
                Delete Selected ({selectedLeadIds.length})
              </button>
            </div>
          </div>
        </>
      )}

      {isAdmin && (
        <>
          <div className="flex items-center justify-end w-full gap-4 mb-4">
            {/* button  */}
            <div className="flex items-center gap-5">
              {isAdmin && (
                <Link
                  to="/leads/add"
                  className="px-5 py-2 text-white rounded bg-[#38D200] hover:opacity-90 transition-opacity"
                >
                  Add Lead
                </Link>
              )}
              <button
                className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors"
                disabled={selectedLeadIds.length === 0}
                onClick={handleBulkDelete}
              >
                Delete Selected ({selectedLeadIds.length})
              </button>
            </div>
          </div>
        </>
      )}

      {/* Table */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden max-sm:overflow-auto text-sm border border-border">
          <table className="w-full table-auto uppercase">
            <thead className="text-white  bg-[#0473EA]">
              <tr>
                <th className="p-2 text-center">
                  {isAgent ? (
                    <></>
                  ) : (
                    <input
                      type="checkbox"
                      onChange={toggleSelectAll}
                      checked={
                        currentLeads.length &&
                        currentLeads.every((l) =>
                          selectedLeadIds.includes(l._id)
                        )
                      }
                    />
                  )}
                </th>

                <th className="p-2 text-center">Name</th>
                <th className="p-2 text-center">Source</th>
                <th className="p-2 text-center">Status</th>
                <th className="p-2 text-center">Note</th>
                <th className="p-2 text-center">Assigned To</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="text-center">
              {currentLeads.map((l) => (
                <tr
                  key={l._id}
                  className="border-b border-border hover:bg-light transition"
                >
                  {/* checkbox */}
                  <td className="p-2">
                    {isAgent ? (
                      <></>
                    ) : (
                      <input
                        type="checkbox"
                        checked={selectedLeadIds.includes(l._id)}
                        onChange={() => toggleSelect(l._id)}
                      />
                    )}
                  </td>

                  <td className="p-2 font-semibold">{l.name}</td>
                  <td className="p-2">{l.source || "-"}</td>
                  <td className="p-2 text-success">
                    <StatusBadge status={l.status} />
                  </td>
                  <td className="p-2 truncate max-w-[150px]">
                    {l.notes || "-"}
                  </td>
                  <td className="p-2 text-success">
                    {l.assignedTo?.name || "-"}
                  </td>

                  <td className="p-2">
                    <Link
                      to={`/leads/${l._id}`}
                      className="text-[rgba(4,115,234,1)] hover:text-[rgba(36,160,140,1)] mr-2"
                    >
                      View
                    </Link>

                    {(isAdmin) && (
                      <Link
                        to={`/leads/${l._id}?edit=true`}
                        className="text-[rgba(56,210,0,1)] hover:text-[rgba(36,160,140,1)] mr-2"
                      >
                        Edit
                      </Link>
                    )}

                    {(isAdmin || isManager) && (
                      <button
                        className="text-danger uppercase"
                        onClick={() => handleDelete(l._id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
     <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
        {/* Prev Button */}
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        {/* First Page */}
        <button
          onClick={() => setCurrentPage(1)}
          className={`px-3 py-1 border rounded ${
            currentPage === 1 ? "bg-[#0473EA] text-white" : ""
          }`}
        >
          1
        </button>

        {/* Left Dots */}
        {currentPage > 3 && <span className="px-2">...</span>}

        {/* Middle Pages (current -1, current, current +1) */}
        {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
          .filter((p) => p > 1 && p < totalPages)
          .map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded ${
                currentPage === page ? "bg-[#0473EA] text-white" : ""
              }`}
            >
              {page}
            </button>
          ))}

        {/* Right Dots */}
        {currentPage < totalPages - 2 && <span className="px-2">...</span>}

        {/* Last Page */}
        {totalPages > 1 && (
          <button
            onClick={() => setCurrentPage(totalPages)}
            className={`px-3 py-1 border rounded ${
              currentPage === totalPages ? "bg-[#0473EA] text-white" : ""
            }`}
          >
            {totalPages}
          </button>
        )}

        {/* Next Button */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* STATUS BADGE */
function StatusBadge({ status }) {
  const styles = {
    new: "bg-light text-dark",
    pending: "bg-warning text-white",
    contacted: "bg-info text-white",
    in_progress: "bg-primary-light text-white",
    won: "bg-success text-white",
    lost: "bg-danger text-white",
  };
  return (
    <span className={`px-2 py-1 rounded text-xs ${styles[status]}`}>
      {status}
    </span>
  );
}
