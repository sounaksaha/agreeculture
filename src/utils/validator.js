import { check } from 'express-validator';

export const validateRegistration = [
  check('email', 'Email is required').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  check('subDistrict','Subdistrict is required').notEmpty().isString()
];
export const validateDistrict = [
  check('code', 'District code is required').notEmpty().isString(),
  check('name', 'Name is required').notEmpty().isString()
];

export const validateSubDistrict = [
  check('districtId', 'Please select a district').notEmpty().isString(),
  check('code', 'SubDistrict code is required').notEmpty().isString(),
  check('name', 'SubDistrictName is required').notEmpty().isString()
];

export const validateVillage = [
  check('subDistrictId', 'Please select a SubDistrict').notEmpty().isString(),
  check('code', 'SubDistrict code is required').notEmpty().isString(),
  check('name', 'SubDistrictName is required').notEmpty().isString()
];