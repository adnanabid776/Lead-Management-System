import express from "express";
import { getAllUsers, createUser, updateUser, deleteUser, getManagers, getAgentsWithManagers, getMyAgents } from "../controllers/userController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/", protect, authorizeRoles("admin","manager"), getAllUsers);
router.post("/", protect, authorizeRoles("admin"), createUser);
router.put("/:id", protect, authorizeRoles("admin"), updateUser);
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);
// router.post("/assign", protect, authorizeRoles("admin"), assignLeadToUser);
router.get("/managers", protect, authorizeRoles("admin") , getManagers);
router.get("/agents", protect, authorizeRoles("admin", "manager"), getAgentsWithManagers);
router.get("/my_agents",protect,authorizeRoles("manager"),getMyAgents);




export default router;
