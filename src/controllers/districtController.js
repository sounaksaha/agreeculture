import District from "../models/District.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { getQueryOptions } from "../utils/queryHelper.js";

export const createDistrict = async (req, res) => {
  const { code, name } = req.body;

  try {
    const existing = await District.findOne({ districtCode: code });
    if (existing) {
      return res
        .status(400)
        .json(
          new ApiResponse(false, 400, "Same district Code Already Present")
        );
    }

    const district = new District({ districtCode: code, districtName: name });
    await district.save();
    res
      .status(201)
      .json(new ApiResponse(true, 201, "District created", district));
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiResponse(false, 500, "Server Error", { error: error.message })
      );
  }
};

export const getDistricts = async (req, res) => {
  try {
    const { searchQuery, skip, limit, page } = getQueryOptions(
      req,
      "districtName"
    );

    const districts = await District.find(searchQuery).skip(skip).limit(limit);

    const total = await District.countDocuments(searchQuery);

    res.status(200).json(
      new ApiResponse(true, 200, "All Data", {
        data: districts,
        page,
        perPage: limit,
        currentCount: districts.length, // 👈 shows how many items were returned on this page
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      })
    );
  } catch (err) {
    res
      .status(500)
      .json(
        new ApiResponse(false, 500, "server error", { message: err.message })
      );
  }
};

export const getDistrictById = async (req, res) => {
  try {
    const { id } = req.query;
    const existing = await District.findById(id);
    if (!existing) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "No District Found"));
    }
    return res
      .status(200)
      .json(new ApiResponse(true, 200, "District Details", existing));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(false, 500, "server error", { message: err.message })
      );
  }
};

export const updateDistrictById = async (req, res) => {
  const { id } = req.query;
  const { code, name } = req.body;

  try {
    const district = await District.findById(id);
    if (!district) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "District not found"));
    }
    if (code) {
      const existing = await District.findOne({
        districtCode: code,
        _id: { $ne: id },
      });
      if (existing) {
        return res
          .status(400)
          .json(
            new ApiResponse(
              false,
              400,
              "Another district with the same code already exists"
            )
          );
      }
    }
    if (code) district.districtCode = code;
    if (name) district.districtName = name;

    await district.save();

    res
      .status(200)
      .json(
        new ApiResponse(true, 200, "District updated successfully", district)
      );
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiResponse(false, 500, "Server Error", { error: error.message })
      );
  }
};

export const deleteDistrictById = async (req, res) => {
  try {
    const { id } = req.query;
    const existing = await District.findById(id);
    if (!existing) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "No District Found"));
    }
    const deleteData = await District.findByIdAndDelete(id);

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
