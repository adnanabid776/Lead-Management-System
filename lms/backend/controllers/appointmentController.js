import Appointment from "../models/appointmentModel.js";
import Lead from "../models/leadModel.js";

// =============== CREATE APPOINTMENT (Agent Only) ================= //
export const createAppointment = async (req, res) => {
  try {
    const { leadEmail, date, mode, notes } = req.body;

    // Only agents can create
    if (req.user.role !== "agent") {
      return res.status(403).json({ message: "Only agents can create appointments" });
    }

    // Find lead
    const lead = await Lead.findOne({ email: leadEmail });
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    // Compare ObjectIds correctly
    if (lead.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "This lead is not assigned to you" });
    }

    // ❌ Check duplicate appointment
    const existingAppt = await Appointment.findOne({
      lead: lead._id,
      assignedTo: req.user._id,
      status: "scheduled"
    });

    if (existingAppt) {
      return res.status(400).json({
        message: "You already have a scheduled appointment with this lead"
      });
    }

    // Update lead status
    lead.status = "contacted";
    await lead.save();

    const appointment = await Appointment.create({
      lead: lead._id,           // ✔ correct
      assignedTo: req.user._id, // ✔ correct
      createdBy: req.user._id,  // ✔ correct
      date,
      mode: mode || "call",
      notes,
      status: "scheduled"
    });

    res.status(201).json({ message: "Appointment created", appointment });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// export const createAppointment = async (req, res) => {
//   try {
//     const { leadEmail, date, mode, notes } = req.body;

//     // Only agents can create
//     if (req.user.role !== "agent") {
//       return res.status(403).json({ message: "Only agents can create appointments" });
//     }

//     // Find lead
//     const lead = await Lead.findOne({ email: leadEmail });
//     if (!lead) return res.status(404).json({ message: "Lead not found" });

//     // Compare ObjectIds correctly
//     if (lead.assignedTo.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "This lead is not assigned to you" });
//     }

//     // ❌ Check duplicate appointment
//     const existingAppt = await Appointment.findOne({
//       lead: lead._id,
//       assignedTo: req.user._id,
//       status: "scheduled"
//     });

//     if (existingAppt) {
//       return res.status(400).json({
//         message: "You already have a scheduled appointment with this lead"
//       });
//     }

//     // Update lead status
//     lead.status = "contacted";
//     await lead.save();

//     const appointment = await Appointment.create({
//       lead: lead._id,           // ✔ correct
//       assignedTo: req.user._id, // ✔ correct
//       createdBy: req.user._id,  // ✔ correct
//       date,
//       mode: mode || "call",
//       notes,
//       status: "scheduled"
//     });

//     res.status(201).json({ message: "Appointment created", appointment });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getAppointments = async (req, res) => {
  try {
    const filter = {};

    // Agent Only Sees Their Own
    if (req.user.role === "agent") {
      filter.assignedTo = req.user._id;   // ✔ correct
    }

    // Admin & Manager: filter optional
    if (req.query.agentId) {
      filter.assignedTo = req.query.agentId;
    }

    const appts = await Appointment.find(filter)
      .populate("lead", "name email")        // <-- populate lead email
      .populate("createdBy", "name email")   // <-- populate creator name
      .populate("assignedTo", "name email") // (optional)
      .sort({ date: -1 });

    res.json(appts);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// =============== UPDATE APPOINTMENT (Agent Only) ================= //
// export const updateAppointment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status, date, notes } = req.body;

//     const appt = await Appointment.findById(id);
//     if (!appt) return res.status(404).json({ message: "Appointment not found" });

//     // Only the agent who created appointment can update
//     if (appt.assignedTo !== req.user.name) {
//       return res.status(403).json({ message: "You cannot update this appointment" });
//     }

//     // Update fields
//     if (date) appt.date = date;
//     if (notes) appt.notes = notes;
//     if (status) appt.status = status;

//     await appt.save();

//     // Status-based Lead updates
//     const lead = await Lead.findOne({ email: appt.lead });

//     if (lead) {
//       if (status === "scheduled") {
//         lead.status = "contacted";
//       } else if (status === "completed" || status === "cancelled") {
//         lead.status = "in_progress";
//       }
//       await lead.save();
//     }

//     res.json({ message: "Appointment updated", appointment: appt });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, date, notes } = req.body;

    const appt = await Appointment.findById(id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });

    // Only the assigned agent can update
   const isOwner = appt.assignedTo.toString() === req.user._id.toString();
const isAgentOrManager = req.user.role === "agent" || req.user.role === "manager";

if (!isOwner && !isAgentOrManager) {
  return res.status(403).json({ message: "You cannot update this appointment" });
}


    // Update fields
    if (date) appt.date = date;
    if (notes) appt.notes = notes;
    if (status) appt.status = status;

    await appt.save();

    // Update lead based on status
    const lead = await Lead.findById(appt.lead);

    if (lead) {
      if (status === "scheduled") {
        lead.status = "contacted";
      } else if (status === "completed" || status === "cancelled") {
        lead.status = "in_progress";
      }
      await lead.save();
    }

    res.json({ message: "Appointment updated", appointment: appt });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =============== DELETE APPOINTMENT (Agent Only) ================= //
// export const deleteAppointment = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const appt = await Appointment.findById(id);
//     if (!appt) return res.status(404).json({ message: "Appointment not found" });

//     // Only owning agent can delete
//     if (appt.assignedTo !== req.user.name) {
//       return res.status(403).json({ message: "You cannot delete this appointment" });
//     }

//     await Appointment.findByIdAndDelete(id);

//     res.json({ message: "Appointment deleted successfully" });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// export const deleteAppointment = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const appt = await Appointment.findById(id);
//     if (!appt) return res.status(404).json({ message: "Appointment not found" });

//     // Only owning agent can delete
//     if (appt.assignedTo.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "You cannot delete this appointment" });
//     }

//     await Appointment.findByIdAndDelete(id);

//     res.json({ message: "Appointment deleted successfully" });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appt = await Appointment.findById(id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });

    // FIX: Allow if user is the assigned agent OR if user is admin/manager
    const isOwner = appt.assignedTo.toString() === req.user._id.toString();
    const isAgentOrManager = req.user.role === "agent" || req.user.role === "manager";

    if (!isOwner && !isAgentOrManager) {
      return res.status(403).json({ message: "You cannot delete this appointment" });
    }

    await Appointment.findByIdAndDelete(id);
    res.json({ message: "Appointment deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};