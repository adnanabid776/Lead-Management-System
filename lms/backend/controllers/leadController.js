import Lead from "../models/leadModel.js";
// import { sendEmail } from "../utils/sendEmail.js";
import User from "../models/userModel.js";
import csv from 'csv-parser';
import { Readable } from "stream";
// import fs from 'fs';
// import {Parser } from "json2csv";
// import path from "path";

// create lead
export const createLead = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "manager")
      return res
        .status(403)
        .json({ message: "Only admin and manger can create leads." });

    const { name, email, notes, phone, source } = req.body;
    const lead = await Lead.create({
      name,
      email,
      phone,
      source,
      notes,
      createdBy: req.user.name, // agent name
      status: "new",
    });
    // if assigned, notify assigned user
    // if (lead.assignedTo) {
    //   const user = await User.findById(lead.assignedTo);
    //   if (user && user.email) {
    //     await sendEmail({
    //       to: user.email,
    //       subject: `New Lead Assigned: ${lead.name}`,
    //       text: `You have been assigned a new lead: ${lead.name}.`,
    //     });
    //   }
    // }

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get leads (with optional filters)
export const getLeads = async (req, res) => {
  try {
    let filter = {};

    // Agent only sees their own assigned leads
    if (req.user.role === "agent") {
      filter.assignedTo = req.user._id;
    }

    // Admin & Manager see all leads → filter remains {}

    const leads = await Lead.find(filter).populate("assignedTo", "name email");

    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get single lead
export const getLeadbyId = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    // Role-based access: non-admins can only see their assigned leads
    if (
      req.user.role === "agent" &&
      lead.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this lead" });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update lead status, add note
export const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const lead = await Lead.findById(id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    if (status) lead.status = status;
    // if (assignedTo) lead.assignedTo = assignedTo;
    if (notes !== undefined) {
      lead.notes = notes;
    }
    await lead.save();

    // If closed/won/lost notify manager/admin
    // if (["won","lost","closed"].includes(lead.status)) {
    //   const admins = await User.find({ role: { $in: ["admin","manager"] } });
    //   for (const a of admins) {
    //     if (a.email) {
    //       await sendEmail({
    //         to: a.email,
    //         subject: `Lead ${lead.status.toUpperCase()}: ${lead.name}`,
    //         text: `Lead ${lead.name} has been marked ${lead.status}.`,
    //       });
    //     }
    //   }
    // }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete lead
export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    // Only admin can delete leads
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can delete leads" });
    }

    await Lead.findByIdAndDelete(id);
    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// BULK DELETE LEADS (Admin Only)
export const bulkDeleteLeads = async (req, res) => {
  try {
    const { leadIds } = req.body;

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return res.status(400).json({ message: "No leads selected" });
    }

    // Only admin can bulk delete
    if (req.user.role !== "admin" && req.user.role !=="manager") {
      return res.status(403).json({ message: "Only admin can delete leads" });
    }

    await Lead.deleteMany({ _id: { $in: leadIds } });

    return res.status(200).json({
      message: "Leads deleted successfully",
      deleted: leadIds.length,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};



// assign lead to user
// Assign Lead To Agent (Manager Only, No Reassign Allowed)
export const assignLeadToAgent = async (req, res) => {
  try {
    const { leadId, agentId } = req.body;

    // 1. Find the lead
    const lead = await Lead.findById(leadId);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    // 2. Check if lead already assigned
    if (lead.assignedTo) {
      return res.status(400).json({ message: "Reassign not allowed" });
    }

    // 3. Verify agent belongs to this manager
    const agent = await User.findOne({
      _id: agentId,
      managerId: req.user._id,
      role: "agent",
    });
    if (!agent) {
      return res
        .status(403)
        .json({ message: "This agent is not under your supervision" });
    }

    // 4. Assign lead
    lead.assignedTo = agentId;
    await lead.save();

    res.status(200).json({ message: "Lead assigned successfully", lead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadLeadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No CSV file uploaded"
      });
    }

    let csvRows = [];
    let inserted = [];
    let skipped = [];

    // Convert memory buffer → stream
    const stream = Readable.from(req.file.buffer);

    // Parse CSV rows
    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on("data", (row) => csvRows.push(row))
        .on("end", resolve)
        .on("error", reject);
    });

    // Process each row
    for (let row of csvRows) {
      const { name, email, phone, source, notes } = row;

      // If email missing, skip row
      if (!email) {
        skipped.push({ row, reason: "Missing email" });
        continue;
      }

      // Check if email already exists
      const exists = await Lead.findOne({ email });

      if (exists) {
        skipped.push({ row, reason: "Duplicate email" });
        continue;
      }

      // Create lead
      const lead = new Lead({
        name,
        email,
        phone,
        source,
        notes,
      });

      await lead.save();
      inserted.push(row);
    }

    return res.json({
      success: true,
      message: "CSV processed successfully",
      totalRows: csvRows.length,
      insertedCount: inserted.length,
      skippedCount: skipped.length,
      inserted,
      skipped
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
export const bulkAssignLeads = async (req, res) => {
  try {
    const { leadIds, agentId } = req.body;

    if (!leadIds || leadIds.length === 0) {
      return res.status(400).json({ message: "No leads provided" });
    }
  const lead = await Lead.findById(leadIds);
 //  Check if lead already assigned
    if (lead.assignedTo) {
      return res.status(400).json({ message: "Reassign not allowed" });
    }

    //  Verify agent belongs to this manager
    const agent = await User.findOne({
      _id: agentId,
      managerId: req.user._id,
      role: "agent",
    });
    if (!agent) {
      return res
        .status(403)
        .json({ message: "This agent is not under your supervision" });
    }



    if (!agentId) {
      return res.status(400).json({ message: "Agent ID required" });
    }

    const result = await Lead.updateMany(
      { _id: { $in: leadIds } },
      {
        $set: {
          assignedTo: agentId,
          status: "assigned",
        },
      }
    );

    return res.status(200).json({
      message: "Bulk assign successful",
      updated: result.modifiedCount,
    });
  } catch (error) {
    console.error("Bulk assign error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


