import express from "express";
import { authorizeRoles, verifyToken } from "../middleware/auth.js";
import { getDistricts } from "../controllers/districtController.js";
import { createFarmer, getAllFarmers } from "../controllers/farmerController.js";
import { getVillageByUser } from "../controllers/userController.js";

const router = express.Router();
router.get("/districts", verifyToken, authorizeRoles("user"), getDistricts);

router.post(
  "/create-farmer",
  verifyToken,
  authorizeRoles("user"),
  createFarmer
);
router.get("/get-farmer",verifyToken,authorizeRoles('user','admin'),getAllFarmers);


router.get("/get-village",verifyToken,authorizeRoles('user'),getVillageByUser);


export default router;
