import express from "express";
import { authorizeRoles, verifyToken } from "../middleware/auth.js";
import {
  getAllFarmers,
  getAvailableFarmersForGroup,
  getFarmerById,
} from "../controllers/farmerController.js";
import { getDashboard } from "../controllers/dashboardController.js";
import {
  changeFarmerGroupStatus,
  createFarmerGroup,
  deleteFarmerGroup,
  getAllFarmerGroups,
  getFarmerGroupById,
  updateFarmerGroupById,
} from "../controllers/farmerGroupController.js";

const router = express.Router();

router.get(
  "/get-farmer",
  verifyToken,
  authorizeRoles("user", "admin"),
  getAllFarmers
);

router.get(
  "/get-farmer-available-for-group",
  verifyToken,
  authorizeRoles("user", "admin"),
  getAvailableFarmersForGroup
);

router.get(
  "/farmer-detail",
  verifyToken,
  authorizeRoles("user", "admin"),
  getFarmerById
);

router.get(
  "/dashboard",
  verifyToken,
  authorizeRoles("user", "admin"),
  getDashboard
);

router.post(
  "/create-group",
  verifyToken,
  authorizeRoles("user", "admin"),
  createFarmerGroup
);
router.get(
  "/get-groupbyid",
  verifyToken,
  authorizeRoles("user", "admin"),
  getFarmerGroupById
);
router.get(
  "/get-group",
  verifyToken,
  authorizeRoles("user", "admin"),
  getAllFarmerGroups
);

router.put(
  "/update-group",
  verifyToken,
  authorizeRoles("user", "admin"),
  updateFarmerGroupById
);

router.delete(
  "/delete-group",
  verifyToken,
  authorizeRoles("user", "admin"),
  deleteFarmerGroup
);

router.patch(
  "/change-groupt-status",
  verifyToken,
  authorizeRoles("user", "admin"),
  changeFarmerGroupStatus
);

export default router;
