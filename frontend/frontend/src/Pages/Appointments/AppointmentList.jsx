import React, { useEffect, useState, useCallback, useContext } from "react";
import { getAppointments,deleteAppointment, updateAppointment, // <-- ADD THIS IMPORT
} from "../../api/appointments";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { toast } from "react-toastify";

export default function AppointmentList() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // pagination states 
    const [currentPage, setCurrentPage] = useState(1);
    const leadsPerPage = 5;
    
  //pagination calculation
  const indexOfLast = currentPage * leadsPerPage;
  const indexOfFirst = indexOfLast - leadsPerPage;
  const currentAppointments = appointments.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(appointments.length / leadsPerPage); 

  // ------ NEW STATES FOR INLINE EDIT ------
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    date: "",
    status: "",
    notes: "",
  });

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAppointments();
      setAppointments(res.data || []);
    } catch (error) {
      console.error("Error fetching appointments", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      await deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      console.error("Delete Error", error);
      toast.error(error.response?.data?.message || "Failed to delete appointment");
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const dt = new Date(dateStr);
    return isNaN(dt) ? dateStr : dt.toLocaleString();
  };

  // ------ INLINE EDIT FUNCTIONS ------
  const startEdit = (appt) => {
    setEditId(appt._id);
    setEditData({
      date: appt.date?.slice(0, 16),
      status: appt.status,
      notes: appt.notes || "",
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({ date: "", status: "", notes: "" });
  };

  const saveEdit = async (id) => {
    try {
      await updateAppointment(id, editData);

      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, ...editData } : a))
      );

      cancelEdit();
    } catch (error) {
      console.error("Update Error", error);
      toast.error(error.response?.data?.message || "Failed to update appointment");
    }
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Appointments</h2>

        {user?.role === "agent" && (
          <Link
            to="/appointments/add"
            className="px-4 py-2 bg-[#38D200] text-white rounded hover:opacity-90 transition-opacity"
          >
            Create Appointment
          </Link>
        )}
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="text-white bg-[#0473EA]">
            <tr className="">
              <th className="p-3">Lead Name</th>
              <th className="p-3">Lead Email</th>
              <th className="p-3 w-40">Created By</th>
              <th className="p-3">Date</th>
              <th className="p-3">Note</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No Appointments Found
                </td>
              </tr>
            ) : (
              currentAppointments.map((appt) => (
                <tr key={appt._id} className=" hover:bg-gray-50 transition">
                  <td className="p-3">{appt.lead?.name || "Unknown Lead"}</td>
                  <td
                    className={`p-3 max-w-[150px] ${
                      editId
                        ? "whitespace-normalwhitespace-normal wrap-break-word"
                        : "truncate whitespace-nowrap text-ellipsis overflow-hidden "
                    }`}
                  >
                    {appt.lead?.email || "-"}
                  </td>
                  <td className="p-3">
                    {appt.assignedTo?.name || "Unknown Agent"}
                  </td>

                  {/* ------- DATE INLINE EDIT ------- */}
                  <td className="p-3 text-sm">
                    {editId === appt._id ? (
                      <input
                        type="datetime-local"
                        className="border rounded p-1 w-38"
                        name="date"
                        value={editData.date}
                        onChange={handleChange}
                      />
                    ) : (
                      formatDate(appt.date)
                    )}
                  </td>
                  <td
                    className={`p-3 ${
                      editId
                        ? ""
                        : "max-w-[150px] truncate whitespace-nowrap text-ellipsis overflow-hidden"
                    }`}
                  >
                    {/* {appt?.notes || "-"} */}

                    {editId === appt._id ? (
                      <input
                        type="text"
                        className="border rounded p-1 w-40"
                        name="notes"
                        value={editData.notes}
                        onChange={handleChange}
                      />
                    ) : (
                      appt?.notes || "-"
                    )}
                  </td>

                  {/* ------- STATUS INLINE EDIT ------- */}
                  <td className="p-3 capitalize">
                    {editId === appt._id ? (
                      <select
                        name="status"
                        className="border p-1 rounded w-28"
                        value={editData.status}
                        onChange={handleChange}
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          appt.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : appt.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {appt.status}
                      </span>
                    )}
                  </td>

                  {/* ------- ACTIONS ------- */}
                  {/* <td className="p-3 text-right space-x-2">
                    {(user?.role === "agent" &&
                      user._id === appt.assignedTo?._id) ? (
                      editId === appt._id ? (
                        <>
                          <button
                            onClick={() => saveEdit(appt._id)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(appt)}
                            className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(appt._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                          >
                            Delete
                          </button>
                        </>
                      )
                    ) : null}
                  </td> */}
                  <td className="p-3 text-right space-x-2">
                    {/* ---------- VIEW BUTTON FOR ADMIN + MANAGER ---------- */}
                    {(user?.role === "admin" || user?.role === "manager") &&
                      (editId === appt._id ? (
                        <>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 text-white rounded text-sm bg-gray-500"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(appt)}
                            className="px-3 py-1 text-white rounded text-sm bg-[#38D200] 
                                hover:opacity-90 transition"
                          >
                            View
                          </button>
                        </>
                      ))}

                    {/* ---------- EDIT/DELETE FOR AGENT (ONLY THEIR OWN APPTS) ---------- */}
                    {user?.role === "agent" &&
                      user._id === appt.assignedTo?._id &&
                      (editId === appt._id ? (
                        <>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => saveEdit(appt._id)}
                              className="px-3 py-1 text-white rounded text-sm bg-[#38D200] "
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 text-white rounded text-sm bg-gray-500"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => startEdit(appt)}
                              className="px-3 py-1 text-white rounded text-sm bg-yellow-500"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(appt._id)}
                              className="px-3 py-1 text-white rounded text-sm bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      ))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      
      {/* <div className="flex justify-center items-center gap-3 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded cursor-pointer ${
              currentPage === i + 1 ? "bg-[#0473EA] text-white " : ""
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div> */}
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
