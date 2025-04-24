import { check } from 'express-validator';

export const validateRegistration = [
  check('email', 'Email is required').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
];
export const validateDistrict = [
  check('code', 'District code is required').notEmpty().isString(),
  check('name', 'Name is required').notEmpty().isString()
];