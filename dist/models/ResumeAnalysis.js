"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ResumeAnalysisSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
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
exports.default = mongoose_1.default.model('ResumeAnalysis', ResumeAnalysisSchema);
