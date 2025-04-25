import SubDistrict from "../models/SubDistrict.js";
import District from "../models/District.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { getQueryOptions } from "../utils/queryHelper.js";

export const createSubDistrict = async (req, res) => {
  const { code, name, districtId } = req.body;

  try {
    // Check for duplicate subDistrictCode
    const existing = await SubDistrict.findOne({ subDistrictCode: code });
    if (existing) {
      return res
        .status(400)
        .json(
          new ApiResponse(false, 400, "Same sub-district Code Already Present")
        );
    }

    // Check if district exists
    const districtExists = await District.findById(districtId);
    if (!districtExists) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "Referenced District not found"));
    }

    const subDistrict = new SubDistrict({
      subDistrictCode: code,
      subDistrictName: name,
      district: districtId,
    });

    await subDistrict.save();

    res
      .status(201)
      .json(new ApiResponse(true, 201, "SubDistrict created", subDistrict));
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiResponse(false, 500, "Server Error", { error: error.message })
      );
  }
};



export const getSubDistricts = async (req, res) => {
  try {
    const { searchQuery, skip, limit, page } = getQueryOptions(req, "subDistrictName");

    const search = req.query.search || "";

    // Aggregation for flexible search (subDistrictName, subDistrictCode, or districtName)
    const matchStage = search
      ? {
          $match: {
            $or: [
              { subDistrictName: { $regex: search, $options: "i" } },
              { subDistrictCode: { $regex: search, $options: "i" } },
            ],
          },
        }
      : { $match: {} };

    const lookupStage = {
      $lookup: {
        from: "districts",
        localField: "district",
        foreignField: "_id",
        as: "district",
      },
    };

    const unwindStage = { $unwind: "$district" };

    const districtNameSearchStage = search
      ? {
          $match: {
            $or: [
              { subDistrictName: { $regex: search, $options: "i" } },
              { subDistrictCode: { $regex: search, $options: "i" } },
              { "district.districtName": { $regex: search, $options: "i" } },
            ],
          },
        }
      : null;

    const pipeline = [
      lookupStage,
      unwindStage,
      ...(search ? [districtNameSearchStage] : []),
      { $skip: skip },
      { $limit: limit },
    ];

    const [subDistricts, total] = await Promise.all([
      SubDistrict.aggregate(pipeline),
      SubDistrict.aggregate([
        lookupStage,
        unwindStage,
        ...(search ? [districtNameSearchStage] : []),
        { $count: "total" },
      ]),
    ]);

    const totalItems = total[0]?.total || 0;

    res.status(200).json(
      new ApiResponse(true, 200, "All SubDistricts", {
        data: subDistricts,
        page,
        perPage: limit,
        currentCount: subDistricts.length,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
      })
    );
  } catch (err) {
    res.status(500).json(
      new ApiResponse(false, 500, "Server Error", { message: err.message })
    );
  }
};
