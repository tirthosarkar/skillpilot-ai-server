import mongoose from 'mongoose';

const RecommendationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  reason: { type: String, required: true },
  type: { type: String, enum: ['Course', 'Project', 'Soft Skill'], required: true },
}, { timestamps: true });

export default mongoose.model('Recommendation', RecommendationSchema);
