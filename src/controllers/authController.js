import jwt from "jsonwebtoken";
import User from "../models/User.js";
import TokenBlacklist from "../models/TokenBlacklist.js";
import { ApiResponse } from "../utils/apiResponse.js";

const generateToken = (payload, expiresIn = "1h") =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

const sendTokens = (res, user) => {
  const accessToken = generateToken({ id: user._id, role: user.role }, "45m");
  const refreshToken = generateToken({ id: user._id }, "7d");

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return accessToken;
};

export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin)
      return res.status(400).json(new ApiResponse(false,400, "Admin already exists"));
    const admin = new User({ email, password, role: "admin" });
    await admin.save();
    res.status(201).json(new ApiResponse(true, 200, "Admin Registered", admin));
  } catch (error) {
    res.status(500).json(new ApiResponse(false, 500, "Server Error", { error: error.message }));
  }
};

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password, role: "user" });
    await user.save();
    res.status(201).json(new ApiResponse(true, 200, "User Registered", user));
  } catch (error) {
    res.status(400).json(new ApiResponse(false,400,"Server Error",{ error: error.message }));
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json(new ApiResponse(false, 401, "Invalid login credentials"));
  }
  const accessToken = sendTokens(res, user);
  res.status(200).json(new ApiResponse(true, 200, "Login Succesfull",{ accessToken,role:user.role }));
};

export const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token)
    return res.status(403).json(new ApiResponse(false, 403, "Refresh token required"));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) throw new Error("Invalid refresh token");

    const accessToken = sendTokens(res, user);
    res.json({ accessToken });
  } catch (error) {
    res.status(403).json(new ApiResponse(false,403,"Invalid or expired refresh token"));
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const accessToken = req.headers.authorization?.split(' ')[1]; // Get access token from header

  try {
    if (refreshToken) {
      const refreshPayload = jwt.verify(refreshToken, process.env.JWT_SECRET);
      await TokenBlacklist.create({
        token: refreshToken,
        expiresAt: new Date(refreshPayload.exp * 1000)
      });
    }
    if (accessToken) {
      const accessPayload = jwt.verify(accessToken, process.env.JWT_SECRET);
      await TokenBlacklist.create({
        token: accessToken,
        expiresAt: new Date(accessPayload.exp * 1000)
      });
    }

    // Clear cookies and respond
    res.clearCookie('refreshToken');
    res.status(200).json(new ApiResponse(true,200,"Logged out successfully"));

  } catch (err) {
    res.clearCookie('refreshToken');
    res.status(200).json(new ApiResponse(true,200,"Logged out (token might be expired)"));
  }
};
