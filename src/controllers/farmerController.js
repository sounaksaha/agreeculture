import { ApiResponse } from "../utils/apiResponse.js";
import SubDistrict from "../models/SubDistrict.js";
import Village from "../models/village.js";
import Farmer from "../models/Farmer.js";
import { getQueryOptions } from "../utils/queryHelper.js";
import mongoose from "mongoose";
import User from "../models/User.js";
import FarmerGroup from "../models/FarmerGroup.js";

export const createFarmer = async (req, res) => {
  try {
    const {
      village,
      subDistrict,
      name,
      gender,
      category,
      divyang,
      aadharNumber,
      panNumber,
      birthYear,
      agristackFarmerNumber,
      mobileNo,
      accountNumber,
      bankName,
      branchName,
      branchIFSC,
      education,
      khatedarNumber8A,
      landHolding8A,
      groupNo7_12,
      rainFedArea,
      irrigatedArea,
      irrigationSource,
      irrigationSourceOther,
      organicFarmingArea,
      animals,

      agriBusiness,
      agriBusinessOther,
      farmMachinery,
      farmMachineryOther,
      highTechAgriculture,
      highTechAgricultureOther,

      mainCrops,
      mainCropsOther,
      latitude,
      longitude,
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
        .json(new ApiResponse(false, 404, "Taluka not found"));
    }

    const farmer = new Farmer({
      user: userId,
      village,
      subDistrict,
      name,
      gender,
      category,
      divyang,
      aadharNumber,
      panNumber,
      birthYear,
      agristackFarmerNumber,
      mobileNo,
      accountNumber,
      bankName,
      branchName,
      branchIFSC,
      education,
      khatedarNumber8A,
      landHolding8A,
      groupNo7_12,
      rainFedArea,
      irrigatedArea,
      irrigationSource,
      irrigationSourceOther,
      organicFarmingArea,
      animals,

      agriBusiness,
      agriBusinessOther,
      farmMachinery,
      farmMachineryOther,
      highTechAgriculture,
      highTechAgricultureOther,

      mainCrops,
      mainCropsOther,
      latitude,
      longitude,
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
    const { page, limit, skip } = getQueryOptions(req);

    const userId = req.user.id;
    const userRole = req.user.role;

    let userSubDistrict = null;

    // 🔍 Get user's subdistrict if role is 'user'
    if (userRole === "user") {
      const user = await User.findById(userId).select("subDistrict");
      if (!user || !user.subDistrict) {
        return res
          .status(400)
          .json(new ApiResponse(false, 400, "User subDistrict not set", null));
      }
      userSubDistrict = user.subDistrict;
    }

    // Extract query filters
    const { villageId, subDistrictId, search } = req.query;

    // Aggregation Stages
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

    const unwindVillageStage = {
      $unwind: {
        path: "$village",
        preserveNullAndEmptyArrays: true,
      },
    };

    // Match stage
    const baseMatch = {};

    // Apply user subdistrict restriction
    if (userRole === "user") {
      baseMatch["subDistrict._id"] = new mongoose.Types.ObjectId(
        userSubDistrict
      );
    }

    // Apply filters from query params
    if (villageId && mongoose.Types.ObjectId.isValid(villageId)) {
      baseMatch["village._id"] = new mongoose.Types.ObjectId(villageId);
    }

    if (subDistrictId && mongoose.Types.ObjectId.isValid(subDistrictId)) {
      baseMatch["subDistrict._id"] = new mongoose.Types.ObjectId(subDistrictId);
    }

    // Search by name or aadharNumber
    if (search) {
      baseMatch.$or = [
        { name: { $regex: search, $options: "i" } },
        { aadharNumber: { $regex: search, $options: "i" } },
      ];
    }

    // Final aggregation pipeline
    const pipeline = [
      lookupVillageStage,
      lookupSubDistrictStage,
      unwindSubDistrictStage,
      unwindVillageStage,
      { $match: baseMatch },
      { $skip: skip },
      { $limit: limit },
    ];

    const countPipeline = [
      lookupVillageStage,
      lookupSubDistrictStage,
      unwindSubDistrictStage,
      unwindVillageStage,
      { $match: baseMatch },
      { $count: "total" },
    ];

    const [farmers, totalResult] = await Promise.all([
      Farmer.aggregate(pipeline),
      Farmer.aggregate(countPipeline),
    ]);

    const totalItems = totalResult[0]?.total || 0;

    return res.status(200).json(
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
    return res.status(500).json(
      new ApiResponse(false, 500, "Server Error", {
        error: error.message,
      })
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
      })
      .populate({
        path: "education",
      })
      .populate({
        path: "irrigationSource",
      })
      .populate({
        path: "animals.animal_id",
      })
      .populate({
        path: "agriBusiness",
      })
      .populate({
        path: "farmMachinery",
      })
      .populate({
        path: "highTechAgriculture",
      })
      .populate("mainCrops");

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
    const { id } = req.query;
    const userId = req.user.id;

    const {
      village,
      subDistrict,
      name,
      gender,
      category,
      divyang,
      aadharNumber,
      panNumber,
      birthYear,
      agristackFarmerNumber,
      mobileNo,
      accountNumber,
      bankName,
      branchName,
      branchIFSC,
      education,
      khatedarNumber8A,
      landHolding8A,
      groupNo7_12,
      rainFedArea,
      irrigatedArea,
      irrigationSource,
      irrigationSourceOther,
      organicFarmingArea,
      animals,

      agriBusiness,
      agriBusinessOther,
      farmMachinery,
      farmMachineryOther,
      highTechAgriculture,
      highTechAgricultureOther,

      mainCrops,
      mainCropsOther,
      latitude,
      longitude,
      remarks,
    } = req.body;

    const farmer = await Farmer.findById(id);

    if (!farmer) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "Farmer not found"));
    }

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

    // Validate village and subDistrict if present
    if (req.body.hasOwnProperty("village")) {
      const villageExists = await Village.findById(village);
      if (!villageExists) {
        return res
          .status(404)
          .json(new ApiResponse(false, 404, "Village not found"));
      }
      farmer.village = village;
    }

    if (req.body.hasOwnProperty("subDistrict")) {
      const subDistrictExists = await SubDistrict.findById(subDistrict);
      if (!subDistrictExists) {
        return res
          .status(404)
          .json(new ApiResponse(false, 404, "Sub-District not found"));
      }
      farmer.subDistrict = subDistrict;
    }

    // List of simple fields to update
    const fields = [
      "name",
      "gender",
      "category",
      "divyang",
      "aadharNumber",
      "panNumber",
      "birthYear",
      "agristackFarmerNumber",
      "mobileNo",
      "accountNumber",
      "bankName",
      "branchName",
      "branchIFSC",
      "education",
      "khatedarNumber8A",
      "landHolding8A",
      "groupNo7_12",
      "rainFedArea",
      "irrigatedArea",
      "irrigationSource",
      "irrigationSourceOther",
      "organicFarmingArea",
      "animals",
      "agriBusiness",
      "agriBusinessOther",
      "farmMachinery",
      "farmMachineryOther",
      "highTechAgriculture",
      "highTechAgricultureOther",
      "mainCrops",
      "mainCropsOther",
      "latitude",
      "longitude",
      "remarks",
    ];

    // Update fields if they are in the request body
    fields.forEach((field) => {
      if (req.body.hasOwnProperty(field)) {
        farmer[field] = req.body[field];
      }
    });

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

export const getAvailableFarmersForGroup = async (req, res) => {
  try {
    const { groupId } = req.query; // Optional: for edit form
    const { page, limit, skip } = getQueryOptions(req);

    // 1️⃣ Get all farmer IDs used in other groups
    const allGroups = await FarmerGroup.find(
      groupId ? { _id: { $ne: groupId } } : {} // exclude current group in edit
    ).select("president secretary memberList");

    const usedFarmerIds = new Set();

    allGroups.forEach((group) => {
      if (group.president) usedFarmerIds.add(group.president.toString());
      if (group.secretary) usedFarmerIds.add(group.secretary.toString());
      group.memberList?.forEach((id) => usedFarmerIds.add(id.toString()));
    });

    // 2️⃣ If editing, allow farmers in the current group
    const includeFarmerIds = new Set();
    if (groupId) {
      const currentGroup = await FarmerGroup.findById(groupId).select(
        "president secretary memberList"
      );
      if (currentGroup) {
        if (currentGroup.president)
          includeFarmerIds.add(currentGroup.president.toString());
        if (currentGroup.secretary)
          includeFarmerIds.add(currentGroup.secretary.toString());
        currentGroup.memberList?.forEach((id) =>
          includeFarmerIds.add(id.toString())
        );
      }
    }

    // 3️⃣ Build exclusion filter
    const exclusionFilter = {
      _id: {
        $nin: Array.from(usedFarmerIds).filter(
          (id) => !includeFarmerIds.has(id)
        ),
      },
    };

    const userId = req.user.id;
    const userRole = req.user.role;

    let userSubDistrict = null;

    // 🔍 Get user's subdistrict if role is 'user'
    if (userRole === "user") {
      const user = await User.findById(userId).select("subDistrict");
      if (!user || !user.subDistrict) {
        return res
          .status(400)
          .json(new ApiResponse(false, 400, "User subDistrict not set", null));
      }
      userSubDistrict = user.subDistrict;
    }

    // Optional: add more filters (search, location)
    const { villageId, search } = req.query;

    if (userSubDistrict && mongoose.Types.ObjectId.isValid(userSubDistrict)) {
      exclusionFilter["subDistrict"] = new mongoose.Types.ObjectId(
        userSubDistrict
      );
    }

    if (villageId && mongoose.Types.ObjectId.isValid(villageId)) {
      exclusionFilter["village"] = new mongoose.Types.ObjectId(villageId);
    }

    if (search) {
      exclusionFilter["$or"] = [
        { name: { $regex: search, $options: "i" } },
        { aadharNumber: { $regex: search, $options: "i" } },
      ];
    }

    // 4️⃣ Fetch filtered farmers
    const farmers = await Farmer.find(exclusionFilter)
      .skip(skip)
      .limit(limit)
      .populate("village subDistrict");

    const totalItems = await Farmer.countDocuments(exclusionFilter);

    return res.status(200).json(
      new ApiResponse(true, 200, "Available farmers fetched successfully", {
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
    return res.status(500).json(
      new ApiResponse(false, 500, "Server Error", {
        error: error.message,
      })
    );
  }
};
