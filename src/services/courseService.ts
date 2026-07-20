import Course from "../models/Course";
import {
  ICourseDocument,
  CourseQueryParams,
  PaginationMeta,
} from "../types";
import { AppError } from "../utils/AppError";

/**
 * Returns courses matching search, category, level filters with pagination.
 */
export const getCoursesWithFilters = async (
  query: CourseQueryParams
): Promise<{ courses: ICourseDocument[]; pagination: PaginationMeta }> => {
  const page = Math.max(1, parseInt(query.page || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || "10", 10)));
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};

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
  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    rating: { rating: -1 },
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
  };

  const sort =
    sortMap[query.sort || "newest"] || {
      createdAt: -1,
    };

  const [courses, total] = await Promise.all([
    Course.find(filter).skip(skip).limit(limit).sort(sort),
    Course.countDocuments(filter),
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

/**
 * Get single course
 */
export const getCourseById = async (
  id: string
): Promise<ICourseDocument> => {
  const course = await Course.findById(id);

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  return course;
};

/**
 * Create course
 */
export const createCourse = async (
  data: Partial<ICourseDocument>
): Promise<ICourseDocument> => {
  return await Course.create(data);
};

/**
 * Update course
 */
export const updateCourse = async (
  id: string,
  data: Partial<ICourseDocument>
): Promise<ICourseDocument> => {
  const course = await Course.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  return course;
};

/**
 * Delete course
 */
export const deleteCourse = async (id: string): Promise<void> => {
  const course = await Course.findByIdAndDelete(id);

  if (!course) {
    throw new AppError("Course not found", 404);
  }
};