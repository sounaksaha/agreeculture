import mongoose from "mongoose";

const farmerGroupSchema = new mongoose.Schema(
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
    groupName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    registrationNo: {
      type: String,
    },
    registrationYear: {
      type: Number,
    },
    bankName: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    ifsc: {
      type: String,
      required: true,
    },
    accountNo: {
      type: String,
    },
    panNo: {
      type: String,
    },
    gstNo: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    president: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
    },
    secretary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
    },
    memberList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Farmer",
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("FarmerGroup", farmerGroupSchema);
