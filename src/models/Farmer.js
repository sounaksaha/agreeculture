import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema(
  {
    village: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Village",
      required: true,
    },
    subDistrict: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubDistrict",
      required: true,
    },
    name: { type: String },
    gender: { type: String },
    category: { type: String }, // e.g. General/SC/ST/OBC
    divyang: { type: String }, // Physical handicap
    aadharNumber: { type: String },
    panNumber: { type: String },
    birthYear: { type: Number },
    agristackFarmerNumber: { type: String },
    mobileNo: { type: String },
    accountNumber: { type: String, unique: true },
    accountHolderName: { type: String },
    bankName: { type: String },
    branchName: { type: String },
    branchIFSC: { type: String },
    education: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Education",
    },
    khatedarNumber8A: { type: String },
    landHolding8A: { type: Number }, // Total area from 8A record
    groupNo7_12: { type: Number },
    rainFedArea: { type: Number },
    irrigatedArea: { type: Number },
    irrigationSource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Irrigation",
    },
    irrigationSourceOther: { type: String },
    organicFarmingArea: { type: Number }, // Organic area (ha)
    documents: [
      {
        name: String, // e.g. "Aadhar", "LandRecord"
        fileUrl: String, // full public URL
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
    // animals
    animals: [
      {
        animal_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Animal",
          required: true,
        },
        count: {
          type: Number,
          default: 0,
        },
      },
    ],

    agriBusiness: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agribusiness", // This should be your model's name
      },
    ],
    agriBusinessOther: { type: String },
    farmMachinery: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Machine", // This should be your model's name
      },
    ],
    farmMachineryOther: { type: String },
    highTechAgriculture: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agriculture", // This should be your model's name
      },
    ],
    highTechAgricultureOther: { type: String },

    mainCrops: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Crops", // This should be your model's name
      },
    ],
    mainCropsOther: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    remarks: { type: String },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Farmer", farmerSchema);
