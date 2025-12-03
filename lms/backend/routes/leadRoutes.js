import express from "express";
import { createLead, getLeads, getLeadbyId, updateLead, deleteLead, assignLeadToAgent,uploadLeadCSV,bulkAssignLeads, bulkDeleteLeads } from "../controllers/leadController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import uploadCSV from "../middlewares/uploadCSV.js";
const router = express.Router();

router.post("/", protect, authorizeRoles("manager","admin"), createLead);
router.post("/upload", protect, authorizeRoles("manager","admin"), uploadCSV.single("file"), uploadLeadCSV);
router.get("/", protect, authorizeRoles("admin","manager","agent"), getLeads);
router.get("/:id", protect, authorizeRoles("admin","manager","agent"), getLeadbyId);
router.put("/:id", protect, authorizeRoles("admin","manager"), updateLead);
router.delete("/:id", protect, authorizeRoles("admin","manager"), deleteLead);
router.post("/bulk-delete", protect, authorizeRoles("admin", "manager"), bulkDeleteLeads);
//router.post("/:id/assign", protect, authorizeRoles("admin"), assignLead);
router.post("/assign", protect, authorizeRoles("manager"), assignLeadToAgent);
router.post("/bulk-assign",protect, authorizeRoles("manager"), bulkAssignLeads);


export default router;
