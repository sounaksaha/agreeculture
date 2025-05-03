import mongoose from 'mongoose';// models/Education.js

const irrigationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  }
});
export default mongoose.model("Irrigation", irrigationSchema);

