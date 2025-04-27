import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema({
  village: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Village",
    required: true
  },
  subDistrict: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubDistrict",
    required: true
  },
  name: { type: String,  },
  aadharNumber: { type: String, },
  birthYear: { type: Number, },
  mobileNo: { type: String,  },
  gender: { type: String,  },
  category: { type: String }, // e.g. General/SC/ST/OBC
  diyaang: { type: String, }, // Physical handicap
  accountHolderName: { type: String },
  totalArea8A: { type: Number }, // Total area from 8A record
  groupNo7_12: { type: String },
  cultivatedArea: { type: Number }, // Cultivated area (this season)
  arableLand: { type: Number }, // Arable land in hectares
  irrigationSource: { type: String },
  organicFarmingArea: { type: Number }, // Organic area (ha)
  education: { type: String },
  numberOfCattle: { type: Number },
  machinery: { type: String },
  majorCrops: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  bankName: { type: String },
  branchName: { type: String },
  branchIFSC: { type: String },
  accountNumber: { type: String },
  panNumber: { type: String },
  remarks: { type: String }
}, { timestamps: true });

export default mongoose.model("Farmer", farmerSchema);
