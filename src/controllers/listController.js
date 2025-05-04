
import Animal from "../models/List/Animal.js";
import Education from "../models/List/Education.js";
import Irrigation from "../models/List/Irrigation.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { getQueryOptions } from "../utils/queryHelper.js";


//Education
export const createEducation = async(req,res)  => {
    try {
        const{type}= req.body;
        const education = new Education({type:type});
        await education.save();
        return res.status(201).json(new ApiResponse(true,201,"Education Created Successfull",education));
    } catch (error) {
        return res.status(500).json(new ApiResponse(false,500,"Server Error",{error:error.message}))
    }
}

export const getEducation = async (req, res) => {
  try {
    const { searchQuery, skip, limit, page } = getQueryOptions(req, [
      "type",
    ]);

    const education = await Education.find(searchQuery).skip(skip).limit(limit);

    const total = await Education.countDocuments(searchQuery);

    res.status(200).json(
      new ApiResponse(true, 200, "All Data", {
        data: education,
        page,
        perPage: limit,
        currentCount: education.length, // 👈 shows how many items were returned on this page
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

export const getEducationById = async (req, res) => {
  try {
    const { id } = req.query;
    const existing = await Education.findById(id);
    if (!existing) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "No Education Found"));
    }
    return res
      .status(200)
      .json(new ApiResponse(true, 200, "Education Details", existing));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(false, 500, "server error", { message: err.message })
      );
  }
};

export const deleteEducationById = async (req, res) => {
  try {
    const { id } = req.query;
    const existing = await Education.findById(id);
    if (!existing) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "No District Found"));
    }
    const deleteData = await Education.findByIdAndDelete(id);

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

export const updateEducationById = async (req, res) => {
  const { id } = req.query;
  const { type } = req.body;

  try {
    const education = await Education.findById(id);
    if (!education) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "Education not found"));
    }
    
    if (type) education.type = type;

    await education.save();
    res
      .status(200)
      .json(
        new ApiResponse(true, 200, "Education updated successfully", education)
      );
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiResponse(false, 500, "Server Error", { error: error.message })
      );
  }
};

//Irrigation
export const createIrrigation = async(req,res)  => {
    try {
        const{type}= req.body;
        const irrigation = new Irrigation({type:type});
        await irrigation.save();
        return res.status(201).json(new ApiResponse(true,201,"Irrigation Created Successfull",irrigation));
    } catch (error) {
        return res.status(500).json(new ApiResponse(false,500,"Server Error",{error:error.message}))
    }
}

export const getIrrigation = async (req, res) => {
    try {
      const { searchQuery, skip, limit, page } = getQueryOptions(req, [
        "type",
      ]);
  
      const irrigation = await Irrigation.find(searchQuery).skip(skip).limit(limit);
  
      const total = await Irrigation.countDocuments(searchQuery);
  
      res.status(200).json(
        new ApiResponse(true, 200, "All Data", {
          data: irrigation,
          page,
          perPage: limit,
          currentCount: irrigation.length, // 👈 shows how many items were returned on this page
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

  export const getIrrigationById = async (req, res) => {
    try {
      const { id } = req.query;
      const existing = await Irrigation.findById(id);
      if (!existing) {
        return res
          .status(404)
          .json(new ApiResponse(false, 404, "No Irrigation Found"));
      }
      return res
        .status(200)
        .json(new ApiResponse(true, 200, "Irrigation Details", existing));
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiResponse(false, 500, "server error", { message: err.message })
        );
    }
  }; 

  export const updateIrrigationById = async (req, res) => {
    const { id } = req.query;
    const { type } = req.body;
  
    try {
      const irrigation = await Irrigation.findById(id);
      if (!irrigation) {
        return res
          .status(404)
          .json(new ApiResponse(false, 404, "Irrigation not found"));
      }
      
      if (type) irrigation.type = type;
  
      await irrigation.save();
      res
        .status(200)
        .json(
          new ApiResponse(true, 200, "Irrigation updated successfully", Irrigation)
        );
    } catch (error) {
      res
        .status(500)
        .json(
          new ApiResponse(false, 500, "Server Error", { error: error.message })
        );
    }
  };

  export const deleteIrrigationById = async (req, res) => {
    try {
      const { id } = req.query;
      const existing = await Irrigation.findById(id);
      if (!existing) {
        return res
          .status(404)
          .json(new ApiResponse(false, 404, "No Irrigation Found"));
      }
      const deleteData = await Irrigation.findByIdAndDelete(id);
  
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

  //Animal
  export const createAnimal = async(req,res)  => {
    try {
        const{type}= req.body;
        const newData = new Animal({type:type});
        await newData.save();
        return res.status(201).json(new ApiResponse(true,201,"Animal Created Successfull",newData));
    } catch (error) {
        return res.status(500).json(new ApiResponse(false,500,"Server Error",{error:error.message}))
    }
}

export const getAnimal = async (req, res) => {
    try {
      const { searchQuery, skip, limit, page } = getQueryOptions(req, [
        "type",
      ]);
  
      const data = await Animal.find(searchQuery).skip(skip).limit(limit);
  
      const total = await Animal.countDocuments(searchQuery);
  
      res.status(200).json(
        new ApiResponse(true, 200, "All Data", {
          data: data,
          page,
          perPage: limit,
          currentCount: data.length, // 👈 shows how many items were returned on this page
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

  export const getAnimalById = async (req, res) => {
    try {
      const { id } = req.query;
      const existing = await Animal.findById(id);
      if (!existing) {
        return res
          .status(404)
          .json(new ApiResponse(false, 404, "No Animal Found"));
      }
      return res
        .status(200)
        .json(new ApiResponse(true, 200, "Animal Details", existing));
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiResponse(false, 500, "server error", { message: err.message })
        );
    }
  }; 

  export const updateAnimalById = async (req, res) => {
    const { id } = req.query;
    const { type } = req.body;
  
    try {
      const data = await Animal.findById(id);
      if (!data) {
        return res
          .status(404)
          .json(new ApiResponse(false, 404, "Data not found"));
      }
      
      if (type) data.type = type;
  
      await data.save();
      res
        .status(200)
        .json(
          new ApiResponse(true, 200, "Animal updated successfully", data)
        );
    } catch (error) {
      res
        .status(500)
        .json(
          new ApiResponse(false, 500, "Server Error", { error: error.message })
        );
    }
  };

  export const deleteAnimalById = async (req, res) => {
    try {
      const { id } = req.query;
      const existing = await Animal.findById(id);
      if (!existing) {
        return res
          .status(404)
          .json(new ApiResponse(false, 404, "No Animal Found"));
      }
      const deleteData = await Animal.findByIdAndDelete(id);
  
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