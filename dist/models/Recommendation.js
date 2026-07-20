"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RecommendationSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    reason: { type: String, required: true },
    type: { type: String, enum: ['Course', 'Project', 'Soft Skill'], required: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model('Recommendation', RecommendationSchema);
