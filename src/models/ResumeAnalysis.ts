import mongoose from 'mongoose';

const ResumeAnalysisSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetRole: { type: String, required: true },
  atsScore: { type: Number, required: true },
  missingSkills: [{
    name: String,
    priority: String,
    type: { type: String }
  }],
  suggestions: [{
    title: String,
    desc: String
  }],
}, { timestamps: true });

export default mongoose.model('ResumeAnalysis', ResumeAnalysisSchema);
