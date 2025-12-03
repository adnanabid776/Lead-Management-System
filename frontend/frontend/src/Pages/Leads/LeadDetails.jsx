import React, { useEffect, useState, useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getLead, updateLead, assignLead } from "../../api/leads";
import { getUsers } from "../../api/users";
import { AuthContext } from "../../Context/AuthContext";
import { toast } from "react-toastify";

export default function LeadDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";

  const { user } = useContext(AuthContext);

  const [lead, setLead] = useState(null);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("");
  const [assigneeEmail, setAssigneeEmail] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getLead(id);
        setLead(res.data);
        setStatus(res.data.status);
        setNotes(res.data.notes || "");
        setAssigneeEmail("");

        const usersRes = await getUsers();
        setUsers(usersRes.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, [id]);

  const handleStatus = async () => {
    try {
      await updateLead(id, { status });

      const res = await getLead(id);
      setLead(res.data);
      setStatus(res.data.status);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };
  const editNotes = async () => {
    try {
      await updateLead(id, { notes });
      const res = await getLead(id);
      setLead(res.data);
      setNotes(res.data.notes || "");
      setNotes("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update notes");
    }
  };

  const handleAssign = async () => {
    if (!assigneeEmail) {
      toast.warning("Please select a user");
      return;
    }

    try {
      await assignLead(id, assigneeEmail);
      const res = await getLead(id);
      setLead(res.data);
      setAssigneeEmail("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to assign lead");
    }
  };

  if (!lead) return <div>Loading...</div>;

  return (
    <div>
      {/* HEADER */}
      <h1 className="text-2xl mb-4 uppercase font-semibold text-gray-800">
        {lead.name}
      </h1>

      {/* LEAD DETAILS CARD */}
      <div className="bg-white p-5 rounded-xl shadow-md border border-border w-[680px] flex flex-col gap-4">
        <div>
          <strong className="text-dark">Email:</strong> {lead.email}
        </div>
        <div>
          <strong className="text-dark">Phone:</strong> {lead.phone || "-"}
        </div>
        <div>
          <strong className="text-dark">Source:</strong> {lead.source || "-"}
        </div>

        <div>
          <strong className="text-dark">Status:</strong>
          <span className="ml-2 px-2 py-1 rounded bg-light text-dark">
            {lead.status}
          </span>
        </div>

        {/* <div>
          <strong className="text-dark">Assigned To:</strong>{" "}
          {lead.assignedTo || "-"}
        </div> */}

        <div>
          <strong className="text-dark">Notes:</strong> {lead.notes || "-"}
        </div>
        {/* <div>
          <strong className="text-dark">Created By:</strong>{" "}
          {lead.createdBy || "-"}
        </div> */}
      </div>

      {/* EDIT MODE */}
      {isEditMode ? (
        <div className="mt-4 space-y-4 w-[680px]">
          {/* ASSIGN LEAD - ADMIN ONLY */}
          {/* {user?.role === "admin" && (
            <div className="bg-white p-4 rounded shadow border border-border">
              <h3 className="font-semibold mb-2 text-primary-dark">
                Assign Lead
              </h3>

              <select
                value={assigneeEmail}
                onChange={(e) => setAssigneeEmail(e.target.value)}
                className="p-2 border border-border rounded mr-2"
              >
                <option value="">--select user--</option>
                {users
                  .filter((u) => ["agent", "manager"].includes(u.role))
                  .map((u) => (
                    <option key={u._id || u.id} value={u.email}>
                      {u.name} ({u.role})
                    </option>
                  ))}
              </select>

              <button
                onClick={handleAssign}
                className="px-3 py-1 bg-[#38D200] text-white rounded hover:opacity-90 transition-opacity"
              >
                Assign
              </button>
            </div>
          )} */}

          {/* STATUS UPDATE – ADMIN + MANAGER */}
          {(user?.role === "admin" || user?.role === "manager") && (
            <div className="bg-white p-4 rounded shadow border border-border w-[680px]">
              <h3 className="font-semibold mb-2 text-[#0473EA]">
                Change Status
              </h3>

              {/* <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="p-2 border border-border rounded mr-2"
              >
                
                <option value="">-Select Status-</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select> */}
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="p-2 border border-border rounded mr-2"
              >
                <option value="">Select Status</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>

              <button
                onClick={() => {
                  if (!status || status === "") {
                    alert("Select the status first");
                    return;
                  }
                  handleStatus();
                }}
                className="px-3 py-1 bg-[#38D200] text-white rounded hover:opacity-90 transition-opacity"
              >
                Update
              </button>

              {/* <button
                onClick={handleStatus}
                className="px-3 py-1 bg-[#38D200] text-white rounded hover:opacity-90 transition-opacity"
              >
                Update
              </button> */}
            </div>
          )}
          {(user?.role === "admin" ||
            user?.role === "manager" ||
            user?.role === "agent") && (
            <>
              <div className="bg-white p-4 rounded shadow border border-border">
                <h3 className="font-semibold mb-2 text-[#0473EA]">
                  Change Notes
                </h3>

                <div className="flex items-center">
                  <textarea
                    name=""
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="p-2 border border-border rounded mr-2 resize-none"
                    cols={30}
                    id=""
                  ></textarea>

                  <button
                    onClick={editNotes}
                    className="px-3 py-1 bg-[#38D200] text-white rounded hover:opacity-90 transition-opacity"
                  >
                    Update
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-muted">VIEW MODE</p>
        </div>
      )}
    </div>
  );
}
