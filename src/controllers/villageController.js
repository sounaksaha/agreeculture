import SubDistrict from "../models/SubDistrict.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { getQueryOptions } from "../utils/queryHelper.js";
import Village from "../models/village.js";

export const createVillage = async (req, res) => {
  const { code, name, subDistrictId } = req.body;

  try {
    // Check for duplicate subDistrictCode
    const existing = await Village.findOne({ villageCode: code });
    if (existing) {
      return res
        .status(400)
        .json(
          new ApiResponse(false, 400, "Same Village Code Already Present")
        );
    }

    // Check if district exists
    const subdistrictExists = await SubDistrict.findById(subDistrictId);
    if (!subdistrictExists) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "Referenced SubDistrict not found"));
    }

    const newvillage = new Village({
      villageCode: code,
      villageName: name,
      subDistrict: subDistrictId,
    });

    await newvillage.save();

    res
      .status(201)
      .json(new ApiResponse(true, 201, "SubDistrict created", newvillage));
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiResponse(false, 500, "Server Error", { error: error.message })
      );
  }
};

export const getVillage = async (req, res) => {
  try {
    const { searchQuery, skip, limit, page } = getQueryOptions(req, "villageName");

    const search = req.query.search || "";

    // Aggregation for flexible search (subDistrictName, subDistrictCode, or districtName)
    const matchStage = search
      ? {
          $match: {
            $or: [
              { villageName: { $regex: search, $options: "i" } },
              { villageCode: { $regex: search, $options: "i" } },
            ],
          },
        }
      : { $match: {} };

    const lookupStage = {
      $lookup: {
        from: "subdistricts",
        localField: "subDistrict",
        foreignField: "_id",
        as: "subDistrict",
      },
    };

    const unwindStage = { $unwind: "$subDistrict" };

    const villageNameSearchStage = search
      ? {
          $match: {
            $or: [
              { villageName: { $regex: search, $options: "i" } },
              { villageCode: { $regex: search, $options: "i" } },
              { "subDistrict.subDistrictName": { $regex: search, $options: "i" } },
            ],
          },
        }
      : null;

    const pipeline = [
      lookupStage,
      unwindStage,
      ...(search ? [villageNameSearchStage] : []),
      { $skip: skip },
      { $limit: limit },
    ];

    const [villages, total] = await Promise.all([
      Village.aggregate(pipeline),
      Village.aggregate([
        lookupStage,
        unwindStage,
        ...(search ? [villageNameSearchStage] : []),
        { $count: "total" },
      ]),
    ]);

    const totalItems = total[0]?.total || 0;

    res.status(200).json(
      new ApiResponse(true, 200, "All Village", {
        data: villages,
        page,
        perPage: limit,
        currentCount: villages.length,
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

export const getSubDistrictById = async (req, res) => {
  const { id } = req.query;

  try {
    const subDistrict = await SubDistrict.findById(id).populate('district'); // Also fetching linked district info if needed

    if (!subDistrict) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "Sub-District not found"));
    }

    res
      .status(200)
      .json(new ApiResponse(true, 200, "Sub-District fetched successfully", subDistrict));
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(false, 500, "Server Error", { error: error.message }));
  }
};

export const updateSubDistrictById = async (req, res) => {
  const { id } = req.query;
  const { code, name, districtId } = req.body;

  try {
    const subDistrict = await SubDistrict.findById(id);

    if (!subDistrict) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "Sub-District not found"));
    }

    // If new code is provided, check for duplicate code (excluding current subdistrict)
    if (code && code !== subDistrict.subDistrictCode) {
      const existing = await SubDistrict.findOne({ subDistrictCode: code });
      if (existing) {
        return res
          .status(400)
          .json(new ApiResponse(false, 400, "Sub-District Code already exists"));
      }
      subDistrict.subDistrictCode = code;
    }

    // If new districtId is provided, check if that district exists
    if (districtId) {
      const districtExists = await District.findById(districtId);
      if (!districtExists) {
        return res
          .status(404)
          .json(new ApiResponse(false, 404, "Referenced District not found"));
      }
      subDistrict.district = districtId;
    }

    // Update name if provided
    if (name) {
      subDistrict.subDistrictName = name;
    }

    await subDistrict.save();

    res
      .status(200)
      .json(new ApiResponse(true, 200, "Sub-District updated successfully", subDistrict));
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(false, 500, "Server Error", { error: error.message }));
  }
};

export const deleteSubDistrictById = async (req, res) => {
  try {
    const { id } = req.query;
    const existing = await SubDistrict.findById(id);
    if (!existing) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "No District Found"));
    }
    const deleteData = await SubDistrict.findByIdAndDelete(id);

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