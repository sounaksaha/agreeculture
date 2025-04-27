import { ApiResponse } from "../utils/apiResponse.js";
import SubDistrict from "../models/SubDistrict.js";
import Village from "../models/village.js";
import Farmer from "../models/Farmer.js";
import { getQueryOptions } from "../utils/queryHelper.js";
import mongoose from "mongoose";

export const createFarmer = async (req, res) => {
  try {
    const {
      village,
      subDistrict,
      name,
      aadharNumber,
      birthYear,
      mobileNo,
      gender,
      category,
      diyaang,
      accountHolderName,
      totalArea8A,
      groupNo7_12,
      cultivatedArea,
      arableLand,
      irrigationSource,
      organicFarmingArea,
      education,
      numberOfCattle,
      machinery,
      majorCrops,
      latitude,
      longitude,
      bankName,
      branchName,
      branchIFSC,
      accountNumber,
      panNumber,
      remarks,
    } = req.body;

    // Get the logged-in user's id
    const userId = req.user?.id; // <-- Assuming you're attaching user info after authentication middleware

    if (!userId) {
      return res
        .status(401)
        .json(new ApiResponse(false, 401, "Unauthorized: User not logged in"));
    }

    // Validate village and subdistrict exist
    const villageExists = await Village.findById(village);
    if (!villageExists) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "Village not found"));
    }

    const subDistrictExists = await SubDistrict.findById(subDistrict);
    if (!subDistrictExists) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "Sub-District not found"));
    }

    const farmer = new Farmer({
      user: userId,
      village,
      subDistrict,
      name,
      aadharNumber,
      birthYear,
      mobileNo,
      gender,
      category,
      diyaang,
      accountHolderName,
      totalArea8A,
      groupNo7_12,
      cultivatedArea,
      arableLand,
      irrigationSource,
      organicFarmingArea,
      education,
      numberOfCattle,
      machinery,
      majorCrops,
      latitude,
      longitude,
      bankName,
      branchName,
      branchIFSC,
      accountNumber,
      panNumber,
      remarks,
    });

    await farmer.save();

    res
      .status(201)
      .json(
        new ApiResponse(true, 201, "Farmer registered successfully", farmer)
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

export const getAllFarmers = async (req, res) => {
  try {
    const { searchQuery, page, limit, skip } = getQueryOptions(req, [
      "name",
      "subDistrict.subDistrictName",
      "subDistrict.subDistrictCode"
    ]);

    const userId = req.user.id;
    const userRole = req.user.role; // 👈 Get role from req.user

    const search = req.query.search || "";

    const lookupSubDistrictStage = {
      $lookup: {
        from: "subdistricts",
        localField: "subDistrict",
        foreignField: "_id",
        as: "subDistrict"
      }
    };

    const unwindSubDistrictStage = {
      $unwind: {
        path: "$subDistrict",
        preserveNullAndEmptyArrays: true
      }
    };

    const baseMatch = {};

    // 🔥 Logic: If user is not admin, filter by user
    if (userRole !== "admin") {
      baseMatch.user = new mongoose.Types.ObjectId(userId);
    }

    // 🔥 Logic: Add search filter
    if (search) {
      baseMatch.$or = [
        { name: { $regex: search, $options: "i" } },
        { "subDistrict.subDistrictName": { $regex: search, $options: "i" } },
        { "subDistrict.subDistrictCode": { $regex: search, $options: "i" } }
      ];
    }

    const pipeline = [
      lookupSubDistrictStage,
      unwindSubDistrictStage,
      { $match: baseMatch },
      { $skip: skip },
      { $limit: limit }
    ];

    const [farmers, totalResult] = await Promise.all([
      Farmer.aggregate(pipeline),
      Farmer.aggregate([
        lookupSubDistrictStage,
        unwindSubDistrictStage,
        { $match: baseMatch },
        { $count: "total" }
      ])
    ]);

    const totalItems = totalResult[0]?.total || 0;

    res.status(200).json(
      new ApiResponse(true, 200, "Farmers fetched successfully", {
        data: farmers,
        page,
        perPage: limit,
        currentCount: farmers.length,
        totalPages: Math.ceil(totalItems / limit),
        totalItems
      })
    );
  } catch (error) {
    console.error(error);
    res.status(500).json(
      new ApiResponse(false, 500, "Server Error", { error: error.message })
    );
  }
};

export const getFarmerById = async (req, res) => {
  try {
    const { id } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    const farmer = await Farmer.findById(id)
      .populate({
        path: 'subDistrict',
        select: 'subDistrictName subDistrictCode'
      })
      .populate({
        path: 'village',
        select: 'villageName villageCode'
      });

    if (!farmer) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "Farmer not found"));
    }

    // 🔥 Check access control: Only admin or owner can access
    if (userRole !== "admin" && farmer.user.toString() !== userId) {
      return res
        .status(403)
        .json(new ApiResponse(false, 403, "Access forbidden"));
    }

    res.status(200).json(
      new ApiResponse(true, 200, "Farmer fetched successfully", farmer)
    );
  } catch (error) {
    console.error(error);
    res.status(500).json(
      new ApiResponse(false, 500, "Server Error", { error: error.message })
    );
  }
};