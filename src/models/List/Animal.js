import mongoose from 'mongoose';// models/Education.js

const animalSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  }
});
export default mongoose.model("Animal", animalSchema);

