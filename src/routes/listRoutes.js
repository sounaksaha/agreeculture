import express from "express";
import { authorizeRoles, verifyToken } from "../middleware/auth.js";
import { createEducation, createIrrigation, deleteEducationById, deleteIrrigationById, getEducation, getEducationById, getIrrigation, getIrrigationById, updateEducationById, updateIrrigationById } from "../controllers/listController.js";

const router = express.Router();

//Education
router.post(
  "/create-education",
  verifyToken,
  authorizeRoles("admin"),
  createEducation
);

router.get(
  "/get-education",
  verifyToken,
  authorizeRoles("admin"),
  getEducation
);

router.get(
  "/get-education-byid",
  verifyToken,
  authorizeRoles("admin"),
  getEducationById
);

router.delete(
  "/delete-education",
  verifyToken,
  authorizeRoles("admin"),
  deleteEducationById
);

router.put(
  "/update-education",
  verifyToken,
  authorizeRoles("admin"),
  updateEducationById
);

//Irrigation
router.post(
  "/create-irrigation",
  verifyToken,
  authorizeRoles("admin"),
  createIrrigation
);

router.get(
  "/get-irrigation",
  verifyToken,
  authorizeRoles("admin"),
  getIrrigation
);

router.get(
  "/get-irrigation-byid",
  verifyToken,
  authorizeRoles("admin"),
  getIrrigationById
);

router.put(
  "/update-irrigation",
  verifyToken,
  authorizeRoles("admin"),
  updateIrrigationById
);

router.delete(
  "/delete-irrigation",
  verifyToken,
  authorizeRoles("admin"),
  deleteIrrigationById
);

export default router;
