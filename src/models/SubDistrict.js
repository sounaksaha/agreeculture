import mongoose from "mongoose";

const subDistrictSchema = new mongoose.Schema({
  subDistrictCode: { type: String, required: true },
  subDistrictName: { type: String, required: true },
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "District",
    required: true,
  },
});

export default mongoose.model("SubDistrict", subDistrictSchema);