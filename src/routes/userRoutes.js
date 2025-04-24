import express from 'express';
import { authorizeRoles, verifyToken } from '../middleware/auth.js';
import { getDistricts } from '../controllers/districtController.js';


const router = express.Router();
router.get('/districts', verifyToken, authorizeRoles('user'), getDistricts);

export default router;
