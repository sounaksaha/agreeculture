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
      horticulturalArea,
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
      horticulturalArea,
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
      "subDistrict.subDistrictCode",
    ]);

    const userId = req.user.id;
    const userRole = req.user.role; // 👈 Get role from req.user

    const search = req.query.search || "";

    const lookupSubDistrictStage = {
      $lookup: {
        from: "subdistricts",
        localField: "subDistrict",
        foreignField: "_id",
        as: "subDistrict",
      },
    };

    const lookupVillageStage = {
      $lookup: {
        from: "villages",
        localField: "village",
        foreignField: "_id",
        as: "village",
      },
    };

    const unwindSubDistrictStage = {
      $unwind: {
        path: "$subDistrict",
        preserveNullAndEmptyArrays: true,
      },
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
        { "subDistrict.subDistrictCode": { $regex: search, $options: "i" } },
      ];
    }

    const pipeline = [
      lookupVillageStage,
      lookupSubDistrictStage,
      unwindSubDistrictStage,
      { $match: baseMatch },
      { $skip: skip },
      { $limit: limit },
    ];

    const [farmers, totalResult] = await Promise.all([
      Farmer.aggregate(pipeline),
      Farmer.aggregate([
        lookupVillageStage,
        lookupSubDistrictStage,
        unwindSubDistrictStage,
        { $match: baseMatch },
        { $count: "total" },
      ]),
    ]);

    const totalItems = totalResult[0]?.total || 0;

    res.status(200).json(
      new ApiResponse(true, 200, "Farmers fetched successfully", {
        data: farmers,
        page,
        perPage: limit,
        currentCount: farmers.length,
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

export const getFarmerById = async (req, res) => {
  try {
    const { id } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    const farmer = await Farmer.findById(id)
      .populate({
        path: "subDistrict",
        select: "subDistrictName subDistrictCode",
      })
      .populate({
        path: "village",
        select: "villageName villageCode",
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

    res
      .status(200)
      .json(new ApiResponse(true, 200, "Farmer fetched successfully", farmer));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(
        new ApiResponse(false, 500, "Server Error", { error: error.message })
      );
  }
};

export const deleteFarmerById = async (req, res) => {
  try {
    const { id } = req.query;
    const existing = await Farmer.findById(id);
    if (!existing) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "No Farmer Found"));
    }
    const deleteData = await Farmer.findByIdAndDelete(id);

    if (deleteData) {
      return res
        .status(200)
        .json(
          new ApiResponse(true, 200, "Deleted Farmer Successfull", deleteData)
        );
    }
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(false, 500, "server error", { message: err.message })
      );
  }
};
export const updateFarmerById = async (req, res) => {
  try {
    const { id } = req.query; // Farmer ID
    const userId = req.user.id; // Logged-in User ID

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
      horticulturalArea,
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

    // Find farmer
    const farmer = await Farmer.findById(id);

    if (!farmer) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "Farmer not found"));
    }

    // 🔥 Allow update only if farmer belongs to logged-in user
    if (farmer.user.toString() !== userId) {
      return res
        .status(403)
        .json(
          new ApiResponse(
            false,
            403,
            "You are not allowed to update this farmer"
          )
        );
    }

    // Optional: Validate new village and subDistrict if changing
    if (village) {
      const villageExists = await Village.findById(village);
      if (!villageExists) {
        return res
          .status(404)
          .json(new ApiResponse(false, 404, "Village not found"));
      }
      farmer.village = village;
    }

    if (subDistrict) {
      const subDistrictExists = await SubDistrict.findById(subDistrict);
      if (!subDistrictExists) {
        return res
          .status(404)
          .json(new ApiResponse(false, 404, "Sub-District not found"));
      }
      farmer.subDistrict = subDistrict;
    }

    // Update simple fields
    if (name) farmer.name = name;
    if (aadharNumber) farmer.aadharNumber = aadharNumber;
    if (birthYear) farmer.birthYear = birthYear;
    if (mobileNo) farmer.mobileNo = mobileNo;
    if (gender) farmer.gender = gender;
    if (category) farmer.category = category;
    if (diyaang) farmer.diyaang = diyaang;
    if (accountHolderName) farmer.accountHolderName = accountHolderName;
    if (totalArea8A) farmer.totalArea8A = totalArea8A;
    if (groupNo7_12) farmer.groupNo7_12 = groupNo7_12;
    if (cultivatedArea) farmer.cultivatedArea = cultivatedArea;
    if (horticulturalArea) farmer.horticulturalArea = horticulturalArea;
    if (irrigationSource) farmer.irrigationSource = irrigationSource;
    if (organicFarmingArea) farmer.organicFarmingArea = organicFarmingArea;
    if (education) farmer.education = education;
    if (numberOfCattle) farmer.numberOfCattle = numberOfCattle;
    if (machinery) farmer.machinery = machinery;
    if (majorCrops) farmer.majorCrops = majorCrops;
    if (latitude) farmer.latitude = latitude;
    if (longitude) farmer.longitude = longitude;
    if (bankName) farmer.bankName = bankName;
    if (branchName) farmer.branchName = branchName;
    if (branchIFSC) farmer.branchIFSC = branchIFSC;
    if (accountNumber) farmer.accountNumber = accountNumber;
    if (panNumber) farmer.panNumber = panNumber;
    if (remarks) farmer.remarks = remarks;

    await farmer.save();

    res
      .status(200)
      .json(new ApiResponse(true, 200, "Farmer updated successfully", farmer));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(
        new ApiResponse(false, 500, "Server Error", { error: error.message })
      );
  }
};
