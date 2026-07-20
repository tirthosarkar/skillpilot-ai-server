import { Request, Response } from "express";
import * as courseService from "../services/courseService";
import { asyncHandler } from "../utils/asyncHandler";
import { sendResponse } from "../utils/sendResponse";
import { CourseQueryParams } from "../types";

// GET /api/courses
export const getCourses = asyncHandler(async (req: Request, res: Response) => {
  const { courses, pagination } = await courseService.getCoursesWithFilters(
    req.query as CourseQueryParams
  );

  sendResponse(res, 200, courses, undefined, {
    count: courses.length,
    pagination,
  });
});

// GET /api/courses/:id
export const getCourse = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const course = await courseService.getCourseById(id);

  sendResponse(res, 200, course);
});

// POST /api/courses
export const createCourse = asyncHandler(async (req: Request, res: Response) => {
  const course = await courseService.createCourse(req.body);

  sendResponse(res, 201, course, "Course created successfully");
});

// PUT /api/courses/:id
export const updateCourse = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const course = await courseService.updateCourse(id, req.body);

  sendResponse(res, 200, course, "Course updated successfully");
});

// DELETE /api/courses/:id
export const deleteCourse = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  await courseService.deleteCourse(id);

  sendResponse(res, 200, null, "Course deleted successfully");
});