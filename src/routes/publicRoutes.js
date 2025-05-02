import express from "express";
import { authorizeRoles, verifyToken } from "../middleware/auth.js";
import {
  getAllFarmers,
  getFarmerById,
} from "../controllers/farmerController.js";
import { getDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

router.get(
  "/get-farmer",
  verifyToken,
  authorizeRoles("user", "admin"),
  getAllFarmers
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

export default router;
