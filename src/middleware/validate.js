import { validationResult } from 'express-validator';
import { ApiResponse } from '../utils/apiResponse.js';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(
      new ApiResponse(false,422,"Please Verify the Entity", {
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg
        }))
      })
    );
  }
  next();
};

export default validate;
