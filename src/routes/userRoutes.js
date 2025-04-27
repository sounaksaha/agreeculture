import express from "express";
import { authorizeRoles, verifyToken } from "../middleware/auth.js";
import { getDistricts } from "../controllers/districtController.js";
import { createFarmer } from "../controllers/farmerController.js";

const router = express.Router();
router.get("/districts", verifyToken, authorizeRoles("user"), getDistricts);

router.post(
  "/create-farmer",
  verifyToken,
  authorizeRoles("user"),
  createFarmer
);

export default router;
