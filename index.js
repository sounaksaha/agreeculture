import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import adminRoutes from "./src/routes/adminRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import publicRoutes from "./src/routes/publicRoutes.js";
import listRoutes from "./src/routes/listRoutes.js";
import { validateRegistration } from "./src/utils/validator.js";
import {
  login,
  logout,
  refresh,
  registerAdmin,
} from "./src/controllers/authController.js";
import connectDB from "./src/config/db.js";
import validate from "./src/middleware/validate.js";
import uploadRoutes from "./src/routes/upload.js";

dotenv.config();
const app = express();

app.set('trust proxy', 1);

// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Auth routes
app.post("/register-admin", validateRegistration, validate, registerAdmin);
app.post("/login", login);
app.get("/refresh-token", refresh);
app.post("/logout", logout);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "✅ Backend is up and running!",
    timestamp: new Date().toISOString(),
  });
});
// Protected routes
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/public",publicRoutes);
app.use("/admin/list",listRoutes)
app.use("/", uploadRoutes);
connectDB()
  .then(() =>
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT}`)
    )
  )
  .catch((err) => console.error(err));
