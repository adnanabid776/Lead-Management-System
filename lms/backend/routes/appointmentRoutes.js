import express from "express";
import { createAppointment, getAppointments, updateAppointment, deleteAppointment } from "../controllers/appointmentController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/", protect, authorizeRoles("agent"), createAppointment);
router.get("/", protect, authorizeRoles("admin","manager","agent"), getAppointments);
router.put("/:id", protect, authorizeRoles("agent", "manager"), updateAppointment);
router.delete("/:id", protect, authorizeRoles("agent", "manager"), deleteAppointment);

export default router;
