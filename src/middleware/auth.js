import jwt from "jsonwebtoken";
import TokenBlacklist from "../models/TokenBlacklist.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const authorizeRoles =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json(
        new ApiResponse(false, 403, "Access Forbidden", {
          message: `Access forbidden for ${req.user.role}`,
        })
      );
    }
    next();
  };

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json(new ApiResponse(false, 401, "Missing or invalid token format"));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json(new ApiResponse(false, 401, "Token not found"));
  }

  const isBlacklisted = await TokenBlacklist.findOne({ token });
  if (isBlacklisted) {
    return res
      .status(401)
      .json(new ApiResponse(false, 401, "Token is blacklisted"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(decoded);

    next();
  } catch (err) {
    return res
      .status(403)
      .json(new ApiResponse(false, 403, "Invalid or expired token"));
  }
};
