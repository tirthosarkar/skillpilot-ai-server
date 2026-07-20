"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.updateCourse = exports.createCourse = exports.getCourseById = exports.getCoursesWithFilters = void 0;
const Course_1 = __importDefault(require("../models/Course"));
const AppError_1 = require("../utils/AppError");
/**
 * Returns courses matching search, category, level filters with pagination.
 */
const getCoursesWithFilters = async (query) => {
    const page = Math.max(1, parseInt(query.page || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || "10", 10)));
    const skip = (page - 1) * limit;
    const filter = {};
    // Search
    if (query.search) {
        filter.$text = { $search: query.search };
    }
    // Category
    if (query.category) {
        filter.category = {
            $regex: query.category,
            $options: "i",
        };
    }
    // Level
    if (query.level) {
        filter.level = query.level;
    }
    // Published
    if (query.isPublished !== "all") {
        filter.isPublished = query.isPublished === "false" ? false : true;
    }
    // Sorting
    const sortMap = {
        newest: { createdAt: -1 },
        oldest: { createdAt: 1 },
        rating: { rating: -1 },
        "price-asc": { price: 1 },
        "price-desc": { price: -1 },
    };
    const sort = sortMap[query.sort || "newest"] || {
        createdAt: -1,
    };
    const [courses, total] = await Promise.all([
        Course_1.default.find(filter).skip(skip).limit(limit).sort(sort),
        Course_1.default.countDocuments(filter),
    ]);
    return {
        courses,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};
exports.getCoursesWithFilters = getCoursesWithFilters;
/**
 * Get single course
 */
const getCourseById = async (id) => {
    const course = await Course_1.default.findById(id);
    if (!course) {
        throw new AppError_1.AppError("Course not found", 404);
    }
    return course;
};
exports.getCourseById = getCourseById;
/**
 * Create course
 */
const createCourse = async (data) => {
    return await Course_1.default.create(data);
};
exports.createCourse = createCourse;
/**
 * Update course
 */
const updateCourse = async (id, data) => {
    const course = await Course_1.default.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (!course) {
        throw new AppError_1.AppError("Course not found", 404);
    }
    return course;
};
exports.updateCourse = updateCourse;
/**
 * Delete course
 */
const deleteCourse = async (id) => {
    const course = await Course_1.default.findByIdAndDelete(id);
    if (!course) {
        throw new AppError_1.AppError("Course not found", 404);
    }
};
exports.deleteCourse = deleteCourse;
