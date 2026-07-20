import mongoose from 'mongoose';

const NodeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'InProgress', 'Completed'], default: 'Pending' },
  type: { type: String, enum: ['Course', 'Project', 'Milestone'], required: true },
});

const RoadmapSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetRole: { type: String, required: true },
  nodes: [NodeSchema],
  progress: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Roadmap', RoadmapSchema);
