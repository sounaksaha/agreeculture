import FarmerGroup from "../models/FarmerGroup.js";
import Village from "../models/village.js";
import SubDistrict from "../models/SubDistrict.js";
import Farmer from "../models/Farmer.js";

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
    const [villageExists, subDistrictExists, presidentExists, secretaryExists] = await Promise.all([
      Village.findById(village),
      SubDistrict.findById(subDistrict),
      Farmer.findById(president),
      Farmer.findById(secretary),
    ]);

    if (!villageExists || !subDistrictExists || !presidentExists || !secretaryExists) {
      return res.status(400).json({ message: "Invalid references (village, subDistrict, president, or secretary)." });
    }

    // Validate memberList
    const validMembers = await Farmer.find({ _id: { $in: memberList } });
    if (validMembers.length !== memberList.length) {
      return res.status(400).json({ message: "One or more member IDs are invalid." });
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
    return res.status(201).json({ message: "Farmer group created successfully.", data: savedGroup });
  } catch (error) {
    console.error("Error creating farmer group:", error);
    return res.status(500).json({ message: "Internal server error." });
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
      return res.status(404).json({ message: "Farmer group not found." });
    }

    res.status(200).json(farmerGroup);
  } catch (error) {
    console.error("Error fetching farmer group:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const deleteFarmerGroup = async (req, res) => {
  try {
    const { id } = req.query;

    const deletedGroup = await FarmerGroup.findByIdAndDelete(id);

    if (!deletedGroup) {
      return res.status(404).json({ message: "Farmer group not found." });
    }

    res.status(200).json({
      message: "Farmer group deleted successfully.",
      data: deletedGroup,
    });
  } catch (error) {
    console.error("Error deleting farmer group:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
