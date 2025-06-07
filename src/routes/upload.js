import express from "express";
import multer from "multer";
import { uploadFile } from "../controllers/uploadController.js";
import { authorizeRoles, verifyToken } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ dest: "temp_uploads/" });

router.post("/upload", upload.single("file"),verifyToken,
  authorizeRoles("user", "admin"), uploadFile);
 
export default router;
