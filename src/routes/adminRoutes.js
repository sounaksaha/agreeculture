import express from "express";

import {
  createDistrict,
  deleteDistrictById,
  getDistrictById,
  getDistricts,
  updateDistrictById,
} from "../controllers/districtController.js";

import { verifyToken, authorizeRoles } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import {
  validateDistrict,
  validateRegistration,
  validateSubDistrict,
  validateVillage,
} from "../utils/validator.js";
import {
  createSubDistrict,
  deleteSubDistrictById,
  getSubDistrictById,
  getSubDistricts,
  updateSubDistrictById,
} from "../controllers/subDistrictController.js";

import {
  createVillage,
  deleteVillageById,
  getVillage,
  getVillageById,
  updateVillageById,
} from "../controllers/villageController.js";

import {
  deleteUserById,
  getAllUsers,
  getUserById,
  registerUser,
  updateUserById,
} from "../controllers/userController.js";
import { createFarmer } from "../controllers/farmerController.js";

const router = express.Router();

router.post(
  "/register-user",
  verifyToken,
  authorizeRoles("admin"),
  validateRegistration,
  validate,
  registerUser
);
router.get("/getusers", verifyToken, authorizeRoles("admin"), getAllUsers);
router.get("/getuser", verifyToken, authorizeRoles("admin"), getUserById);
router.put(
  "/update-user",
  verifyToken,
  authorizeRoles("admin"),
  validateRegistration,
  validate,
  updateUserById
);
router.delete(
  "/delete-user",
  verifyToken,
  authorizeRoles("admin"),
  deleteUserById
);

router.post(
  "/create-district",
  verifyToken,
  authorizeRoles("admin"),
  validateDistrict,
  validate,
  createDistrict
);
router.get("/districts", verifyToken, authorizeRoles("admin"), getDistricts);
router.get("/district", verifyToken, authorizeRoles("admin"), getDistrictById);
router.put(
  "/district",
  verifyToken,
  authorizeRoles("admin"),
  validateDistrict,
  validate,
  updateDistrictById
);
router.delete(
  "/district",
  verifyToken,
  authorizeRoles("admin"),
  deleteDistrictById
);

router.post(
  "/create-subdistrict",
  verifyToken,
  authorizeRoles("admin"),
  validateSubDistrict,
  validate,
  createSubDistrict
);
router.get(
  "/subdistricts",
  verifyToken,
  authorizeRoles("admin"),
  getSubDistricts
);
router.get(
  "/subdistrict",
  verifyToken,
  authorizeRoles("admin"),
  getSubDistrictById
);
router.put(
  "/subdistrict",
  verifyToken,
  authorizeRoles("admin"),
  validateSubDistrict,
  validate,
  updateSubDistrictById
);
router.delete(
  "/subdistrict",
  verifyToken,
  authorizeRoles("admin"),
  deleteSubDistrictById
);

router.post(
  "/create-village",
  verifyToken,
  authorizeRoles("admin"),
  validateVillage,
  validate,
  createVillage
);
router.get("/villages", verifyToken, authorizeRoles("admin"), getVillage);
router.get("/village", verifyToken, authorizeRoles("admin"), getVillageById);
router.put(
  "/village",
  verifyToken,
  authorizeRoles("admin"),
  validateVillage,
  validate,
  updateVillageById
);
router.delete(
  "/village",
  verifyToken,
  authorizeRoles("admin"),
  deleteVillageById
);

export default router;
