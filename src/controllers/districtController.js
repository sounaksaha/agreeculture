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
    const { searchQuery, skip, limit, page } = getQueryOptions(req, 'districtName');

    const districts = await District.find(searchQuery)
      .skip(skip)
      .limit(limit);

    const total = await District.countDocuments(searchQuery);

    res.status(200).json(
      new ApiResponse(true, 200, "All Data", {
        data: districts,
        page,
        perPage: limit,
        currentCount: districts.length, // 👈 shows how many items were returned on this page
        totalPages: Math.ceil(total / limit),
        totalItems: total
      })
    );
  } catch (err) {
    res.status(500).json(
      new ApiResponse(false, 500, "server error", { message: err.message })
    );
  }
};