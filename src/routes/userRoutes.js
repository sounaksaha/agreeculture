import express from "express";
import { authorizeRoles, verifyToken } from "../middleware/auth.js";
import { getDistricts } from "../controllers/districtController.js";
import {
  deleteFarmerById,
  createFarmer,
  updateFarmerById,
} from "../controllers/farmerController.js";
import { getVillageByUser } from "../controllers/userController.js";
import { createFarmerGroup, deleteFarmerGroup, getFarmerGroupById } from "../controllers/farmerGroupController.js";

const router = express.Router();
router.get("/districts", verifyToken, authorizeRoles("user"), getDistricts);

router.post(
  "/create-farmer",
  verifyToken,
  authorizeRoles("user"),
  createFarmer
);
router.delete(
  "/delete-farmer",
  verifyToken,
  authorizeRoles("user"),
  deleteFarmerById
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

// router.post(
//   "/create-group",
//   verifyToken,
//   authorizeRoles("user"),
//   createFarmerGroup
// );
// router.get(
//   "/get-groupbyid",
//   verifyToken,
//   authorizeRoles("user"),
//  getFarmerGroupById
// );

// router.delete(
//   "/delete-group",
//   verifyToken,
//   authorizeRoles("user"),
//  deleteFarmerGroup
// );


export default router;
