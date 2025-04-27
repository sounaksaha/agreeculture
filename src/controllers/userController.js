import User from "../models/User.js";
import { ApiResponse } from "../utils/apiResponse.js";
import SubDistrict from "../models/SubDistrict.js";
import { getQueryOptions } from "../utils/queryHelper.js";

export const registerUser = async (req, res) => {
  try {
    const { email, password, subDistrict } = req.body;

    // Check if subDistrict exists
    const subDistrictExists = await SubDistrict.findById(subDistrict);
    if (!subDistrictExists) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "Sub-District not found"));
    }

    // Check if email already exists manually (optional, double-safe)
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res
        .status(409)
        .json(new ApiResponse(false, 409, "Email already registered"));
    }

    const user = new User({
      email,
      password,
      role: "user",
      subDistrict,
    });

    await user.save();

    res
      .status(201)
      .json(new ApiResponse(true, 201, "User registered successfully", user));
  } catch (error) {
    console.error(error);

    // Handle duplicate key error by MongoDB
    if (error.code === 11000 && error.keyPattern?.email) {
      return res
        .status(409)
        .json(new ApiResponse(false, 409, "Email already registered"));
    }

    res
      .status(500)
      .json(
        new ApiResponse(false, 500, "Server Error", { error: error.message })
      );
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { searchQuery, page, limit, skip } = getQueryOptions(req, [
      "email",
      "_id",
    ]);

    const search = req.query.search || "";

    const lookupSubDistrictStage = {
      $lookup: {
        from: "subdistricts", // 👈 Correct lowercase collection name
        localField: "subDistrict",
        foreignField: "_id",
        as: "subDistrict",
      },
    };

    const unwindSubDistrictStage = {
      $unwind: {
        path: "$subDistrict",
        preserveNullAndEmptyArrays: true,
      },
    };

    const matchStage = {
      $match: {
        role: "user", // 👈 add this condition
        ...(search && {
          $or: [
            { email: { $regex: search, $options: "i" } },
            { _id: { $regex: search, $options: "i" } },
            {
              "subDistrict.subDistrictName": { $regex: search, $options: "i" },
            },
          ],
        }),
      },
    };

    const pipeline = [
      lookupSubDistrictStage,
      unwindSubDistrictStage,
      matchStage,
      { $skip: skip },
      { $limit: limit },
    ];

    const [users, totalResult] = await Promise.all([
      User.aggregate(pipeline),
      User.aggregate([
        lookupSubDistrictStage,
        unwindSubDistrictStage,
        matchStage,
        { $count: "total" },
      ]),
    ]);

    const totalItems = totalResult[0]?.total || 0;

    res.status(200).json(
      new ApiResponse(true, 200, "All Users", {
        data: users,
        page,
        perPage: limit,
        currentCount: users.length,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
      })
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(
        new ApiResponse(false, 500, "Server Error", { error: error.message })
      );
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.query;

  try {
    const user = await User.findById(id).populate("subDistrict"); // Also fetching linked district info if needed

    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "User not found"));
    }

    res
      .status(200)
      .json(new ApiResponse(true, 200, "User fetched successfully", user));
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiResponse(false, 500, "Server Error", { error: error.message })
      );
  }
};

export const updateUserById = async (req, res) => {
  try {
    const { id } = req.query;
    const { email, password, subDistrict } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "User not found"));
    }

    // Update email (with duplicate check)
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res
          .status(409)
          .json(new ApiResponse(false, 409, "Email already registered"));
      }
      user.email = email;
    }

    // Update password (with rehash)
    if (password) {
      user.password = password; // Let pre('save') hook handle hashing
    }

    // Update subDistrict (only if provided)
    if (subDistrict) {
      const subDistrictExists = await SubDistrict.findById(subDistrict);
      if (!subDistrictExists) {
        return res
          .status(404)
          .json(new ApiResponse(false, 404, "Sub-District not found"));
      }
      user.subDistrict = subDistrict;
    }

    await user.save(); // Pre-save hook will hash password if modified

    res
      .status(200)
      .json(new ApiResponse(true, 200, "User updated successfully", user));
  } catch (error) {
    console.error(error);

    // Duplicate key error fallback (extra safety)
    if (error.code === 11000 && error.keyPattern?.email) {
      return res
        .status(409)
        .json(new ApiResponse(false, 409, "Email already registered"));
    }

    res
      .status(500)
      .json(
        new ApiResponse(false, 500, "Server Error", { error: error.message })
      );
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.query;
    const existing = await User.findById(id);
    if (!existing) {
      return res.status(404).json(new ApiResponse(false, 404, "No User Found"));
    }
    const deleteData = await User.findByIdAndDelete(id);

    if (deleteData) {
      return res
        .status(200)
        .json(new ApiResponse(true, 200, "Delete Successfull", deleteData));
    }
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(false, 500, "server error", { message: err.message })
      );
  }
};
