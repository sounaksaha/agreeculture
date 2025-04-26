import mongoose from "mongoose";

const villageSchema = new mongoose.Schema({
  villageCode: { type: String, required: true },
  villageName: { type: String, required: true },
  subDistrict: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubDistrict",
    required: true,
  },
});

export default mongoose.model("Village", villageSchema);