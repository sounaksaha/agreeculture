import District from "../models/District.js";
import Farmer from "../models/Farmer.js";
import SubDistrict from "../models/SubDistrict.js";
import User from "../models/User.js";

import village from "../models/village.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getDashboard = async (req, res) => {
  try {
    const { role, id: userId } = req.user; // you said only id and role

    if (role === "admin") {
      // Admin: Fetch all data
      const [totalUsers, districts, villages, subDistricts, totalFarmers] =
        await Promise.all([
          User.countDocuments({ role: "user" }),
          District.countDocuments({}),
          village.countDocuments({}),
          SubDistrict.countDocuments({}),
          Farmer.countDocuments({}),
        ]);

      return res.status(200).json(
        new ApiResponse(true, 200, "Successfully fetched data", {
          totalUsers,
          districts,
          villages,
          subDistricts,
          totalFarmers,
        })
      );
    } else {
      // Normal User: Fetch limited data

      // Fetch user details to get subDistrictId
      const user = await User.findById(userId);

      if (!user) {
        return res
          .status(404)
          .json(new ApiResponse(false, 404, "User not found"));
      }

      if (!user.subDistrict) {
        return res
          .status(400)
          .json(
            new ApiResponse(
              false,
              400,
              "User is not assigned to any subdistrict"
            )
          );
      }

      // Count villages under user's subdistrict
      const villages = await village.countDocuments({
        subDistrict: user.subDistrict,
      });

      // Count farmers created by this user
      const totalFarmers = await Farmer.countDocuments({ user: userId }); // Assuming createdBy field exists in Farmer model

      return res.status(200).json(
        new ApiResponse(true, 200, "Successfully fetched user-specific data", {
          villages,
          totalFarmers,
        })
      );
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(
        new ApiResponse(false, 500, "Server error", { message: err.message })
      );
  }
};
