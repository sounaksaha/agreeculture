import mongoose from "mongoose";

const districtSchema = new mongoose.Schema({
  districtCode: { type: String, required: true },
  districtName: { type: String, required: true },
});

export default mongoose.model("District", districtSchema);
