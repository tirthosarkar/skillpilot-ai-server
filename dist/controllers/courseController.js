"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.updateCourse = exports.createCourse = exports.getCourse = exports.getCourses = void 0;
const courseService = __importStar(require("../services/courseService"));
const asyncHandler_1 = require("../utils/asyncHandler");
const sendResponse_1 = require("../utils/sendResponse");
// GET /api/courses
exports.getCourses = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { courses, pagination } = await courseService.getCoursesWithFilters(req.query);
    (0, sendResponse_1.sendResponse)(res, 200, courses, undefined, {
        count: courses.length,
        pagination,
    });
});
// GET /api/courses/:id
exports.getCourse = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const course = await courseService.getCourseById(id);
    (0, sendResponse_1.sendResponse)(res, 200, course);
});
// POST /api/courses
exports.createCourse = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const course = await courseService.createCourse(req.body);
    (0, sendResponse_1.sendResponse)(res, 201, course, "Course created successfully");
});
// PUT /api/courses/:id
exports.updateCourse = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const course = await courseService.updateCourse(id, req.body);
    (0, sendResponse_1.sendResponse)(res, 200, course, "Course updated successfully");
});
// DELETE /api/courses/:id
exports.deleteCourse = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    await courseService.deleteCourse(id);
    (0, sendResponse_1.sendResponse)(res, 200, null, "Course deleted successfully");
});
