import express from "express";
import { authorizeRoles, verifyToken } from "../middleware/auth.js";
import { createEducation, deleteEducationById, getEducation, getEducationById, updateEducationById } from "../controllers/listController.js";

const router = express.Router();

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



export default router;
