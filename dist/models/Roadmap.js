"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const NodeSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'InProgress', 'Completed'], default: 'Pending' },
    type: { type: String, enum: ['Course', 'Project', 'Milestone'], required: true },
});
const RoadmapSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    targetRole: { type: String, required: true },
    nodes: [NodeSchema],
    progress: { type: Number, default: 0 },
}, { timestamps: true });
exports.default = mongoose_1.default.model('Roadmap', RoadmapSchema);
