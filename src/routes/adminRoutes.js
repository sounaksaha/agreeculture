import express from 'express';
import { registerUser } from '../controllers/authController.js';
import { createDistrict, getDistricts  } from '../controllers/districtController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { validateDistrict, validateRegistration } from '../utils/validator.js';
import { createSubDistrict, getSubDistricts } from '../controllers/subDistrictController.js';

const router = express.Router();

router.post('/register-user', verifyToken, authorizeRoles('admin'), validateRegistration,validate, registerUser);
router.post('/create-district', verifyToken, authorizeRoles('admin'),validateDistrict,validate, createDistrict);
router.get('/districts', verifyToken, authorizeRoles('admin'), getDistricts);
router.post('/create-subdistrict', verifyToken, authorizeRoles('admin'),validateDistrict,validate, createSubDistrict);
router.get('/subdistrict', verifyToken, authorizeRoles('admin'),validateDistrict,validate, getSubDistricts);


export default router;
