import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import adminRoutes from './src/routes/adminRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import { validateRegistration } from './src/utils/validator.js';
import { login, logout, refresh, registerAdmin } from './src/controllers/authController.js';
import connectDB from './src/config/db.js';
import validate from './src/middleware/validate.js';


dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

// Auth routes
app.post('/register-admin', validateRegistration,validate, registerAdmin);
app.post('/login', login);
app.post('/refresh-token', refresh);
app.post('/logout', logout);

// Protected routes
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

connectDB()
  .then(() => app.listen(process.env.PORT || 5000, () => console.log(`🚀 Server running on port ${process.env.PORT}`)))
  .catch(err => console.error(err));
