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

export const getVillageById = async (req, res) => {
  const { id } = req.query;

  try {
    const village = await Village.findById(id).populate('subDistrict'); // Also fetching linked district info if needed

    if (!village) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "Village not found"));
    }

    res
      .status(200)
      .json(new ApiResponse(true, 200, "Village fetched successfully", village));
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(false, 500, "Server Error", { error: error.message }));
  }
};

export const updateVillageById = async (req, res) => {
  const { id } = req.query;
  const { code, name, subDistrictId } = req.body;

  try {
    const village = await Village.findById(id);

    if (!village) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "Village not found"));
    }

    // If new code is provided, check for duplicate code (excluding current subdistrict)
    if (code && code !== village.villageCode) {
      const existing = await Village.findOne({ villageCode: code });
      if (existing) {
        return res
          .status(400)
          .json(new ApiResponse(false, 400, "Village Code already exists"));
      }
      village.villageCode = code;
    }

    // If new districtId is provided, check if that district exists
    if (subDistrictId ) {
      const subdistrictExists = await SubDistrict.findById(subDistrictId);
      if (!subdistrictExists) {
        return res
          .status(404)
          .json(new ApiResponse(false, 404, "Referenced Sub District not found"));
      }
      village.subDistrict = subDistrictId ;
    }

    // Update name if provided
    if (name) {
      village.villageName = name;
    }

    await village.save();

    res
      .status(200)
      .json(new ApiResponse(true, 200, "Village updated successfully", village));
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(false, 500, "Server Error", { error: error.message }));
  }
};

export const deleteVillageById = async (req, res) => {
  try {
    const { id } = req.query;
    const existing = await Village.findById(id);
    if (!existing) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "No Village Found"));
    }
    const deleteData = await Village.findByIdAndDelete(id);

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