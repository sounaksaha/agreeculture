import mongoose from 'mongoose';

const TokenBlacklistSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } } // <--- TTL index
}, { timestamps: true });


export default mongoose.model('TokenBlacklist', TokenBlacklistSchema);
