import { ApiResponse } from "../utils/apiResponse.js";
import SubDistrict from "../models/SubDistrict.js";
import Village from "../models/village.js";
import Farmer from "../models/Farmer.js";

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
