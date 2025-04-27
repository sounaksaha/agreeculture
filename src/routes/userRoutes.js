import express from "express";
import { authorizeRoles, verifyToken } from "../middleware/auth.js";
import { getDistricts } from "../controllers/districtController.js";
import {
  createFarmer,
  getAllFarmers,
  updateFarmerById,
} from "../controllers/farmerController.js";
import { getVillageByUser } from "../controllers/userController.js";

const router = express.Router();
router.get("/districts", verifyToken, authorizeRoles("user"), getDistricts);

router.post(
  "/create-farmer",
  verifyToken,
  authorizeRoles("user"),
  createFarmer
);

router.put(
  "/update-farmer",
  verifyToken,
  authorizeRoles("user"),
  updateFarmerById
);

router.get(
  "/get-village",
  verifyToken,
  authorizeRoles("user"),
  getVillageByUser
);



export default router;
