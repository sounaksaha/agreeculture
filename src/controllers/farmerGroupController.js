import FarmerGroup from "../models/FarmerGroup.js";
import Village from "../models/village.js";
import SubDistrict from "../models/SubDistrict.js";
import Farmer from "../models/Farmer.js";
import User from "../models/User.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { getQueryOptions } from "../utils/queryHelper.js";
import mongoose from "mongoose";

/**
 * Create a new FarmerGroup
 */
export const createFarmerGroup = async (req, res) => {
  try {
    const {
      village,
      subDistrict,
      groupName,
      address,
      registrationNo,
      registrationYear,
      bankName,
      branch,
      ifsc,
      accountNo,
      panNo,
      gstNo,
      email,
      president,
      secretary,
      memberList,
      remarks,
    } = req.body;

    // Basic validation
    if (
      !village ||
      !subDistrict ||
      !groupName ||
      !address ||
      !bankName ||
      !branch ||
      !ifsc ||
      !email ||
      !president ||
      !secretary ||
      !memberList ||
      !Array.isArray(memberList)
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Validate referenced IDs (optional but good practice)
    const [villageExists, subDistrictExists, presidentExists, secretaryExists] =
      await Promise.all([
        Village.findById(village),
        SubDistrict.findById(subDistrict),
        Farmer.findById(president),
        Farmer.findById(secretary),
      ]);

    if (
      !villageExists ||
      !subDistrictExists ||
      !presidentExists ||
      !secretaryExists
    ) {
      return res
        .status(400)
        .json({
          message:
            "Invalid references (village, subDistrict, president, or secretary).",
        });
    }

    // Validate memberList
    const validMembers = await Farmer.find({ _id: { $in: memberList } });
    if (validMembers.length !== memberList.length) {
      return res
        .status(400)
        .json({ message: "One or more member IDs are invalid." });
    }

    const newGroup = new FarmerGroup({
      village,
      subDistrict,
      groupName,
      address,
      registrationNo,
      registrationYear,
      bankName,
      branch,
      ifsc,
      accountNo,
      panNo,
      gstNo,
      email,
      president,
      secretary,
      memberList,
      remarks,
    });

    const savedGroup = await newGroup.save();
    return res
      .status(201)
      .json(
        new ApiResponse(
          true,
          201,
          "Farmer group created successfully.",
          savedGroup
        )
      );
  } catch (error) {
    console.error("Error creating farmer group:", error);
    return res
      .status(500)
      .json(new ApiResponse(false, 500, "Server Error.", error.message));
  }
};

export const getAllFarmerGroups = async (req, res) => {
  try {
    const { page, limit, skip } = getQueryOptions(req);

    const userId = req.user.id;
    const userRole = req.user.role;

    let userSubDistrict = null;

    if (userRole === "user") {
      const user = await User.findById(userId).select("subDistrict");
      if (!user || !user.subDistrict) {
        return res
          .status(400)
          .json(new ApiResponse(false, 400, "User subDistrict not set", null));
      }
      userSubDistrict = user.subDistrict;
    }

    const { villageId, subDistrictId, search } = req.query;

    // Match filters
    const matchStage = {};

    if (search) {
      matchStage.groupName = { $regex: search, $options: "i" };
    }

    if (villageId && mongoose.Types.ObjectId.isValid(villageId)) {
      matchStage.village = new mongoose.Types.ObjectId(villageId);
    }

    if (subDistrictId && mongoose.Types.ObjectId.isValid(subDistrictId)) {
      matchStage.subDistrict = new mongoose.Types.ObjectId(subDistrictId);
    }

    if (userRole === "user") {
      matchStage.subDistrict = new mongoose.Types.ObjectId(userSubDistrict);
    }

    const totalItems = await FarmerGroup.countDocuments(matchStage);

    const groups = await FarmerGroup.find(matchStage)
      .populate("village")
      .populate("subDistrict")
      .populate("president")
      .populate("secretary")
      .populate("memberList")
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json(
      new ApiResponse(true, 200, "Farmer groups fetched successfully", {
        data: groups,
        page,
        perPage: limit,
        currentCount: groups.length,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
      })
    );
  } catch (error) {
    console.error("Error fetching farmer groups:", error);
    return res.status(500).json(
      new ApiResponse(false, 500, "Server Error", {
        error: error.message,
      })
    );
  }
};

export const getFarmerGroupById = async (req, res) => {
  try {
    const { id } = req.query;

    const farmerGroup = await FarmerGroup.findById(id)
      .populate("village")
      .populate("subDistrict")
      .populate("president")
      .populate("secretary")
      .populate("memberList");

    if (!farmerGroup) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "Farmer group not found."));
    }

    res
      .status(200)
      .json(new ApiResponse(true, 200, "Group Details", farmerGroup));
  } catch (error) {
    console.error("Error fetching farmer group:", error);
    res.status(500).json(new ApiResponse(false, 500, "Internal server error."));
  }
};


export const updateFarmerGroupById = async (req, res) => {
  try {
    const { id } = req.query;
    const {
      village,
      subDistrict,
      groupName,
      address,
      registrationNo,
      registrationYear,
      bankName,
      branch,
      ifsc,
      accountNo,
      panNo,
      gstNo,
      email,
      president,
      secretary,
      memberList,
      remarks,
    } = req.body;

    const group = await FarmerGroup.findById(id);
    if (!group) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "Farmer group not found", null));
    }

    // Update all fields
    group.village = village ?? group.village;
    group.subDistrict = subDistrict ?? group.subDistrict;
    group.groupName = groupName ?? group.groupName;
    group.address = address ?? group.address;
    group.registrationNo = registrationNo ?? group.registrationNo;
    group.registrationYear = registrationYear ?? group.registrationYear;
    group.bankName = bankName ?? group.bankName;
    group.branch = branch ?? group.branch;
    group.ifsc = ifsc ?? group.ifsc;
    group.accountNo = accountNo ?? group.accountNo;
    group.panNo = panNo ?? group.panNo;
    group.gstNo = gstNo ?? group.gstNo;
    group.email = email ?? group.email;
    group.president = president ?? group.president;
    group.secretary = secretary ?? group.secretary;
    group.memberList = memberList ?? group.memberList;
    group.remarks = remarks ?? group.remarks;

    const updatedGroup = await group.save();

    // Populate the updated fields
    const populated = await FarmerGroup.findById(updatedGroup._id)
      .populate("village")
      .populate("subDistrict")
      .populate("president")
      .populate("secretary")
      .populate("memberList");

    return res
      .status(200)
      .json(
        new ApiResponse(true, 200, "Farmer group updated successfully", populated)
      );
  } catch (error) {
    console.error("Error updating farmer group:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(false, 500, "Server Error", { error: error.message })
      );
  }
};

export const deleteFarmerGroup = async (req, res) => {
  try {
    const { id } = req.query;

    const deletedGroup = await FarmerGroup.findByIdAndDelete(id);

    if (!deletedGroup) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "Farmer group not found."));
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          true,
          200,
          "Farmer group deleted successfully.",
          deletedGroup
        )
      );
  } catch (error) {
    console.error("Error deleting farmer group:", error);
    res.status(500).json(new ApiResponse(false, 500, "Internal server error."));
  }
};
