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
    phoneNumber: {
      type: String,
      required: true,
    },
    registrationNo: {
      type: String,
    },
    registrationYear: {
      type: Number,
    },
    groupMeetingDate: {
      type: String,
      required: true,
    },
    groupNameResolutionPassed: {
      type: String,
      required: true,
    },
    groupPurposeResolutionPassed: {
      type: String,
      required: true,
    },
    groupPresidentSecretaryResolutionPassed: {
      type: String,
      required: true,
    },
    groupBankAccountResolutionPassed: {
      type: String,
      required: true,
    },
    groupMonthlySubscriptionResolutionPassed: {
      type: String,
      required: true,
    },
    groupCertificateAgricultureAssistantPresent: {
      type: String,
      required: true,
    },
    groupNameAgricultureAssistantPresent: {
      type: String,
      required: true,
    },
    recommendationLetterNumber: {
      type: Number,
      required: true,
    },
    recommendationLetterDate: {
      type: String,
      required: true,
    },
    recommendationTalukaAgricultureOfficerName: {
      type: String,
      required: true,
    },
    registrationFeesPaidDetails: {
      type: String,
      required: true,
    },
    registrationFeesPaidDetailsOther: {
      type: String,
    },
    registrationFeesPaidRupees: {
      type: Number,
      required: true,
    },
    registrationFeesPaidDate: {
      type: String,
      required: true,
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

    accountNo: {
      type: String,
    },
    panNo: {
      type: String,
    },
    gstNo: {
      type: String,
    },
    documents: [
      {
        name: String, // e.g. "BankProof", "ResolutionLetter"
        fileUrl: String, // e.g. "https://atmacsn.org/assets/myfile.pdf"
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },

  { timestamps: true }
);

export default mongoose.model("FarmerGroup", farmerGroupSchema);
