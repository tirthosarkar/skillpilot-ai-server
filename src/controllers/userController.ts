import { Response } from "express";
import * as userService from "../services/userService";
import { asyncHandler } from "../utils/asyncHandler";
import { sendResponse } from "../utils/sendResponse";
import { AuthRequest, UserQueryParams } from "../types";

// GET /api/users (admin)
export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { users, pagination } = await userService.getAllUsers(
    req.query as UserQueryParams
  );

  sendResponse(res, 200, users, undefined, {
    count: users.length,
    pagination,
  });
});

// GET /api/users/:id (admin)
export const getUserById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;

  const user = await userService.getUserById(id);

  sendResponse(res, 200, user);
});

// PUT /api/users/:id (admin)
export const adminUpdateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;

  const user = await userService.adminUpdateUser(id, req.body);

  sendResponse(res, 200, user, "User updated");
});

// DELETE /api/users/:id (admin)
export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;

  await userService.deleteUser(id, req.user!.id);

  sendResponse(res, 200, null, "User deleted successfully");
});

// GET /api/users/profile
export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await userService.getUserById(req.user!.id);

  sendResponse(res, 200, user);
});

// PUT /api/users/profile
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await userService.updateUserProfile(req.user!.id, req.body);

  sendResponse(res, 200, user, "Profile updated");
});